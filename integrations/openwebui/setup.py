#!/usr/bin/env python3
"""
Open WebUI Integration Setup
Automatically configure Open WebUI to work with AI Architect Academy patterns.
"""
import os
import json
import yaml
import subprocess
import shutil
import logging
from pathlib import Path
from typing import Dict, List, Any
import click
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.panel import Panel

console = Console()
logger = logging.getLogger(__name__)

class OpenWebUIIntegrator:
    """Integrates AI Architect Academy patterns with Open WebUI."""
    
    def __init__(self, base_dir: Path):
        self.base_dir = Path(base_dir)
        self.openwebui_dir = self.base_dir / "open-webui"
        self.patterns_dir = self.base_dir / "01-design-patterns"
        self.projects_dir = self.base_dir / "05-projects"
        
    def check_prerequisites(self) -> bool:
        """Check if required tools are installed."""
        required_tools = ['docker', 'docker-compose', 'git']
        
        for tool in required_tools:
            if not shutil.which(tool):
                console.print(f"[red]❌ {tool} is required but not found[/red]")
                return False
        
        return True
    
    def clone_openwebui(self) -> bool:
        """Clone Open WebUI repository."""
        try:
            if self.openwebui_dir.exists():
                console.print("[yellow]⚠️ Open WebUI already exists, updating...[/yellow]")
                subprocess.run(['git', 'pull'], cwd=self.openwebui_dir, check=True)
            else:
                console.print("[blue]📥 Cloning Open WebUI...[/blue]")
                subprocess.run([
                    'git', 'clone', 
                    'https://github.com/open-webui/open-webui.git',
                    str(self.openwebui_dir)
                ], check=True)
            
            return True
            
        except subprocess.CalledProcessError as e:
            console.print(f"[red]❌ Failed to clone Open WebUI: {e}[/red]")
            return False
    
    def create_custom_functions(self) -> bool:
        """Create custom functions for AI Architect Academy patterns."""
        functions_dir = self.openwebui_dir / "backend" / "apps" / "webui" / "routers" / "utils"
        functions_dir.mkdir(parents=True, exist_ok=True)
        
        # Create pattern selector function
        pattern_selector = functions_dir / "pattern_selector.py"
        pattern_selector.write_text('''
"""
AI Architect Academy Pattern Selector
Custom function to recommend patterns based on requirements.
"""
import json
from typing import Dict, List, Any

def get_pattern_recommendations(requirements: Dict[str, str]) -> List[Dict[str, Any]]:
    """Get pattern recommendations based on user requirements."""
    
    patterns = {
        "content-generation": {
            "name": "Content Generation Pattern",
            "description": "Generate high-quality content using LLMs",
            "use_cases": ["blog posts", "documentation", "marketing copy"],
            "complexity": "medium",
            "deployment_time": "2 hours"
        },
        "decision-support": {
            "name": "Decision Support Pattern", 
            "description": "AI-powered decision making and recommendations",
            "use_cases": ["business intelligence", "risk assessment", "optimization"],
            "complexity": "high",
            "deployment_time": "4 hours"
        },
        "rag-system": {
            "name": "RAG (Retrieval-Augmented Generation)",
            "description": "Question answering over proprietary documents",
            "use_cases": ["knowledge base", "document search", "customer support"],
            "complexity": "medium",
            "deployment_time": "3 hours"
        },
        "model-lifecycle": {
            "name": "Model Lifecycle Management",
            "description": "End-to-end ML model management and deployment",
            "use_cases": ["MLOps", "model versioning", "continuous deployment"],
            "complexity": "high", 
            "deployment_time": "6 hours"
        }
    }
    
    # Simple recommendation logic based on keywords
    recommendations = []
    for pattern_id, pattern in patterns.items():
        score = 0
        
        # Score based on use case matching
        for use_case in pattern["use_cases"]:
            if any(keyword in requirements.get("description", "").lower() 
                   for keyword in use_case.split()):
                score += 1
        
        # Score based on complexity preference
        if requirements.get("complexity") == pattern["complexity"]:
            score += 2
            
        if score > 0:
            pattern_copy = pattern.copy()
            pattern_copy["id"] = pattern_id
            pattern_copy["score"] = score
            recommendations.append(pattern_copy)
    
    # Sort by score
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations[:3]

class PatternSelectorFilter:
    """Open WebUI filter for pattern selection."""
    
    class Valves:
        priority: int = 0
        
    def __init__(self):
        self.valves = self.Valves()
        
    async def inlet(self, body: dict, user: dict = None) -> dict:
        """Process incoming requests for pattern recommendations."""
        
        messages = body.get("messages", [])
        if not messages:
            return body
            
        last_message = messages[-1].get("content", "")
        
        # Check if user is asking for pattern recommendations
        if any(keyword in last_message.lower() for keyword in [
            "recommend pattern", "which pattern", "pattern selection", 
            "ai architecture", "design pattern"
        ]):
            # Extract requirements from message
            requirements = {
                "description": last_message,
                "complexity": "medium"  # default
            }
            
            recommendations = get_pattern_recommendations(requirements)
            
            if recommendations:
                response = "Based on your requirements, I recommend these AI architecture patterns:\\n\\n"
                
                for i, pattern in enumerate(recommendations, 1):
                    response += f"{i}. **{pattern['name']}**\\n"
                    response += f"   - Description: {pattern['description']}\\n"
                    response += f"   - Deployment time: {pattern['deployment_time']}\\n"
                    response += f"   - Use cases: {', '.join(pattern['use_cases'])}\\n\\n"
                
                response += "Would you like detailed implementation steps for any of these patterns?"
                
                # Inject the response
                messages.append({
                    "role": "assistant", 
                    "content": response
                })
                body["messages"] = messages
        
        return body
        ''')
        
        # Create RAG integration function
        rag_integration = functions_dir / "rag_integration.py"
        rag_integration.write_text('''
"""
RAG System Integration for Open WebUI
Connect to AI Architect Academy RAG implementation.
"""
import asyncio
import httpx
from typing import Dict, List, Any, Optional

class RAGIntegration:
    """Integration with AI Architect Academy RAG system."""
    
    def __init__(self, rag_api_url: str = "http://localhost:8000"):
        self.rag_api_url = rag_api_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def query_rag(self, query: str, max_results: int = 5) -> Dict[str, Any]:
        """Query the RAG system."""
        try:
            response = await self.client.post(
                f"{self.rag_api_url}/query",
                json={
                    "query": query,
                    "max_results": max_results,
                    "similarity_threshold": 0.7,
                    "include_sources": True
                }
            )
            response.raise_for_status()
            return response.json()
            
        except httpx.RequestError as e:
            return {"error": f"RAG system unavailable: {e}"}
        except httpx.HTTPStatusError as e:
            return {"error": f"RAG query failed: {e.response.status_code}"}

class RAGFilter:
    """Open WebUI filter for RAG integration."""
    
    class Valves:
        priority: int = 0
        rag_api_url: str = "http://localhost:8000"
        enable_rag: bool = True
        
    def __init__(self):
        self.valves = self.Valves()
        self.rag = RAGIntegration(self.valves.rag_api_url)
        
    async def inlet(self, body: dict, user: dict = None) -> dict:
        """Process incoming requests with RAG enhancement."""
        
        if not self.valves.enable_rag:
            return body
            
        messages = body.get("messages", [])
        if not messages:
            return body
            
        last_message = messages[-1].get("content", "")
        
        # Check if message seems to be asking about documentation or patterns
        rag_keywords = [
            "how to", "what is", "explain", "documentation", 
            "pattern", "implementation", "example", "tutorial"
        ]
        
        if any(keyword in last_message.lower() for keyword in rag_keywords):
            # Query RAG system
            rag_result = await self.rag.query_rag(last_message)
            
            if "error" not in rag_result:
                # Enhance the message with RAG context
                context = f"Context from AI Architect Academy documentation:\\n"
                context += f"Answer: {rag_result.get('answer', '')}\\n\\n"
                
                if rag_result.get('sources'):
                    context += "Relevant sources:\\n"
                    for i, source in enumerate(rag_result['sources'][:3], 1):
                        context += f"{i}. {source.get('content', '')[:200]}...\\n"
                
                enhanced_message = f"{context}\\n\\nUser question: {last_message}"
                messages[-1]["content"] = enhanced_message
                body["messages"] = messages
        
        return body
        ''')
        
        return True
    
    def create_docker_compose(self) -> bool:
        """Create enhanced docker-compose with AI Architect Academy integration."""
        
        compose_config = {
            'version': '3.8',
            'services': {
                'open-webui': {
                    'build': {
                        'context': '.',
                        'dockerfile': 'Dockerfile'
                    },
                    'container_name': 'open-webui-ai-academy',
                    'volumes': [
                        'open-webui:/app/backend/data',
                        './custom_functions:/app/backend/apps/webui/routers/utils/custom_functions'
                    ],
                    'ports': ['3001:8080'],
                    'environment': [
                        'OLLAMA_BASE_URL=http://ollama:11434',
                        'WEBUI_SECRET_KEY=your-secret-key-here',
                        'RAG_API_URL=http://rag-api:8000'
                    ],
                    'extra_hosts': ['host.docker.internal:host-gateway'],
                    'restart': 'unless-stopped',
                    'depends_on': ['ollama']
                },
                'ollama': {
                    'image': 'ollama/ollama:latest',
                    'container_name': 'ollama-ai-academy', 
                    'volumes': ['ollama:/root/.ollama'],
                    'ports': ['11434:11434'],
                    'restart': 'unless-stopped',
                    'deploy': {
                        'resources': {
                            'reservations': {
                                'devices': [{
                                    'driver': 'nvidia',
                                    'count': 1,
                                    'capabilities': ['gpu']
                                }]
                            }
                        }
                    }
                },
                # Include RAG system from AI Architect Academy
                'rag-api': {
                    'build': {
                        'context': '../05-projects/rag-complete-implementation',
                        'dockerfile': 'Dockerfile'
                    },
                    'container_name': 'rag-api-ai-academy',
                    'environment': [
                        'OPENAI_API_KEY=${OPENAI_API_KEY}',
                        'SUPABASE_URL=${SUPABASE_URL}',
                        'SUPABASE_KEY=${SUPABASE_KEY}'
                    ],
                    'ports': ['8000:8000'],
                    'restart': 'unless-stopped'
                }
            },
            'volumes': {
                'ollama': {},
                'open-webui': {}
            }
        }
        
        compose_file = self.openwebui_dir / "docker-compose.ai-academy.yml"
        with open(compose_file, 'w') as f:
            yaml.dump(compose_config, f, default_flow_style=False)
        
        return True
    
    def create_startup_script(self) -> bool:
        """Create startup script with AI Architect Academy integration."""
        
        script_content = '''#!/bin/bash
# Open WebUI with AI Architect Academy Integration

set -e

echo "🚀 Starting Open WebUI with AI Architect Academy Integration"

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
WEBUI_SECRET_KEY=$(openssl rand -hex 32)
EOF
    echo "⚠️  Please update .env with your API keys"
fi

# Pull latest models
echo "📥 Pulling recommended models..."
docker-compose -f docker-compose.ai-academy.yml up -d ollama
sleep 10

# Install recommended models
echo "🧠 Installing AI models..."
docker exec ollama-ai-academy ollama pull llama2
docker exec ollama-ai-academy ollama pull codellama:7b
docker exec ollama-ai-academy ollama pull mistral

# Start all services
echo "🏗️ Starting all services..."
docker-compose -f docker-compose.ai-academy.yml up -d

echo "✅ Setup complete!"
echo ""
echo "🌐 Open WebUI: http://localhost:3001"
echo "📖 RAG API: http://localhost:8000/docs"
echo "📊 Monitor: docker-compose -f docker-compose.ai-academy.yml logs -f"
echo ""
echo "🎯 Try asking: 'Recommend a pattern for content generation'"
'''
        
        script_path = self.openwebui_dir / "start-ai-academy.sh"
        script_path.write_text(script_content)
        script_path.chmod(0o755)
        
        return True
    
    def create_readme(self) -> bool:
        """Create integration README."""
        
        readme_content = '''# Open WebUI + AI Architect Academy Integration

This integration connects Open WebUI with AI Architect Academy patterns and RAG system.

## Features

- 🤖 **Pattern Recommendations**: Ask "recommend a pattern" to get AI architecture suggestions
- 📚 **RAG Integration**: Query AI Architect Academy documentation directly in chat
- 🔧 **Custom Functions**: Pre-built functions for common architecture tasks
- 🐳 **Easy Deployment**: One-command setup with Docker

## Quick Start

1. **Prerequisites**:
   ```bash
   # Install Docker and Docker Compose
   # Get API keys: OpenAI, Supabase (optional)
   ```

2. **Setup**:
   ```bash
   cd open-webui
   ./start-ai-academy.sh
   ```

3. **Access**:
   - Open WebUI: http://localhost:3001
   - RAG API: http://localhost:8000/docs

## Usage Examples

### Pattern Recommendations
```
User: "I need to build a content generation system for my blog"
AI: Recommends Content Generation Pattern with implementation details
```

### RAG Queries
```
User: "How do I implement vector search with pgvector?"
AI: Searches AI Architect Academy docs and provides specific implementation
```

### Architecture Guidance
```
User: "What's the best way to handle ML model deployments?"
AI: Suggests Model Lifecycle Management pattern with enterprise considerations
```

## Custom Functions

- `pattern_selector.py`: Intelligent pattern recommendations
- `rag_integration.py`: Documentation search and retrieval
- `architecture_advisor.py`: Best practice suggestions

## Configuration

Edit `.env` file:
```bash
OPENAI_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
RAG_API_URL=http://rag-api:8000
```

## Monitoring

```bash
# View logs
docker-compose -f docker-compose.ai-academy.yml logs -f

# Check health
curl http://localhost:8000/health
curl http://localhost:3001/health
```

## Troubleshooting

### RAG System Not Responding
```bash
# Restart RAG service
docker-compose -f docker-compose.ai-academy.yml restart rag-api

# Check RAG logs
docker logs rag-api-ai-academy
```

### Models Not Loading
```bash
# Reinstall models
docker exec ollama-ai-academy ollama pull llama2
docker exec ollama-ai-academy ollama list
```

## Advanced Usage

### Custom Model Integration
```python
# Add to custom functions
class CustomModelFilter:
    def __init__(self):
        self.model_endpoint = "http://your-model:8080"
    
    async def inlet(self, body: dict) -> dict:
        # Your custom model logic
        return body
```

### Pattern Development
```python
# Extend pattern recommendations
def add_custom_pattern(pattern_id: str, pattern_config: dict):
    # Register new pattern with system
    pass
```

## Support

- 📖 Documentation: [AI Architect Academy](https://github.com/AI-Architect-Academy/ai-architect-academy)
- 💬 Issues: Create GitHub issue with `openwebui-integration` label
- 🔧 Development: See CONTRIBUTING.md

---

**Built with ❤️ by AI Architect Academy**
'''
        
        readme_path = self.openwebui_dir / "README-AI-ACADEMY.md"
        readme_path.write_text(readme_content)
        
        return True

@click.command()
@click.option('--base-dir', default='.', help='Base directory of AI Architect Academy')
@click.option('--auto-start', is_flag=True, help='Automatically start services after setup')
def main(base_dir: str, auto_start: bool):
    """Setup Open WebUI integration with AI Architect Academy."""
    
    base_path = Path(base_dir).resolve()
    integrator = OpenWebUIIntegrator(base_path)
    
    console.print(Panel.fit(
        "[bold blue]Open WebUI + AI Architect Academy Integration[/bold blue]\n"
        "Setting up intelligent pattern recommendations and RAG integration",
        title="🤖 AI Integration Setup"
    ))
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        
        # Check prerequisites
        task = progress.add_task("Checking prerequisites...", total=None)
        if not integrator.check_prerequisites():
            console.print("[red]❌ Prerequisites check failed[/red]")
            return
        progress.update(task, description="✅ Prerequisites checked")
        
        # Clone Open WebUI
        progress.update(task, description="📥 Setting up Open WebUI...")
        if not integrator.clone_openwebui():
            console.print("[red]❌ Failed to setup Open WebUI[/red]")
            return
        
        # Create custom functions
        progress.update(task, description="🔧 Creating custom functions...")
        if not integrator.create_custom_functions():
            console.print("[red]❌ Failed to create custom functions[/red]")
            return
        
        # Create Docker Compose
        progress.update(task, description="🐳 Creating Docker configuration...")
        if not integrator.create_docker_compose():
            console.print("[red]❌ Failed to create Docker configuration[/red]")
            return
        
        # Create startup script
        progress.update(task, description="📜 Creating startup script...")
        if not integrator.create_startup_script():
            console.print("[red]❌ Failed to create startup script[/red]")
            return
        
        # Create README
        progress.update(task, description="📖 Creating documentation...")
        if not integrator.create_readme():
            console.print("[red]❌ Failed to create documentation[/red]")
            return
        
        progress.update(task, description="✅ Integration setup complete!")
    
    console.print(Panel.fit(
        "[green]✅ Open WebUI integration setup complete![/green]\n\n"
        f"📁 Location: {integrator.openwebui_dir}\n"
        "🚀 Start: ./start-ai-academy.sh\n"
        "🌐 Web UI: http://localhost:3001\n"
        "📖 API Docs: http://localhost:8000/docs\n\n"
        "Try asking: 'Recommend a pattern for my use case'",
        title="🎉 Setup Complete"
    ))
    
    if auto_start:
        console.print("[blue]🚀 Starting services...[/blue]")
        os.chdir(integrator.openwebui_dir)
        subprocess.run(['./start-ai-academy.sh'])

if __name__ == '__main__':
    main()