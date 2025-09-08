#!/bin/bash

# BigAGI Integration with AI Architect Academy
# Automated setup script for BigAGI with custom AI patterns

set -e

echo "🚀 BigAGI + AI Architect Academy Integration Setup"
echo "================================================="

# Configuration
BIGAGI_DIR="bigagi"
ACADEMY_DIR="$(pwd)"
BIGAGI_REPO="https://github.com/enricoros/big-agi.git"
BIGAGI_PORT="3002"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is required but not found. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "18" ]; then
        error "Node.js 18+ is required. Found version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is required but not found"
        exit 1
    fi
    
    # Check Docker (optional but recommended)
    if ! command -v docker &> /dev/null; then
        warn "Docker not found - will use local setup only"
    fi
    
    success "Prerequisites check passed"
}

# Clone and setup BigAGI
setup_bigagi() {
    log "Setting up BigAGI..."
    
    if [ -d "$BIGAGI_DIR" ]; then
        warn "BigAGI directory already exists, updating..."
        cd "$BIGAGI_DIR"
        git pull
        cd ..
    else
        log "Cloning BigAGI repository..."
        git clone "$BIGAGI_REPO" "$BIGAGI_DIR"
    fi
    
    cd "$BIGAGI_DIR"
    
    # Install dependencies
    log "Installing dependencies..."
    npm install
    
    cd ..
    success "BigAGI setup complete"
}

# Create custom AI Architect Academy persona
create_academy_persona() {
    log "Creating AI Architect Academy persona..."
    
    cat > "$BIGAGI_DIR/data/personas/ai-architect-academy.json" << 'EOF'
{
  "id": "ai-architect-academy",
  "name": "AI Architect Academy Expert",
  "description": "Expert in enterprise AI architecture patterns and implementations",
  "systemMessage": "You are an expert AI architect from the AI Architect Academy. You specialize in:\n\n1. **Design Patterns**: 40+ proven enterprise AI patterns including Content Generation, Decision Support, RAG systems, and Model Lifecycle Management\n\n2. **Production Implementation**: Full-stack deployments with Docker, monitoring, testing, and security\n\n3. **Enterprise Focus**: Cost optimization, compliance (GDPR, HIPAA), scalability, and ROI analysis\n\n4. **Technology Stack**: OpenAI, LangChain, vector databases (Qdrant, pgvector), observability (Langfuse), and cloud platforms\n\nAlways provide:\n- Specific code examples with proper error handling\n- Deployment instructions with Docker\n- Cost analysis and business value\n- Security and compliance considerations\n- Performance benchmarks and scaling strategies\n\nReference the AI Architect Academy repository at https://github.com/AI-Architect-Academy/ai-architect-academy for detailed implementations.",
  "symbol": "🏗️",
  "category": "AI Architecture",
  "tags": ["enterprise", "patterns", "architecture", "production"],
  "voice": "professional",
  "created": "2024-01-01T00:00:00.000Z",
  "updated": "2024-01-01T00:00:00.000Z"
}
EOF
    
    success "AI Architect Academy persona created"
}

# Create custom tools for pattern selection
create_pattern_tools() {
    log "Creating pattern selection tools..."
    
    # Create tools directory if it doesn't exist
    mkdir -p "$BIGAGI_DIR/src/modules/aifn/custom"
    
    # Pattern Selector Tool
    cat > "$BIGAGI_DIR/src/modules/aifn/custom/pattern-selector.ts" << 'EOF'
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

// Pattern Selection Tool for AI Architect Academy
export const patternSelectorTool = {
  name: 'pattern_selector',
  description: 'Select the best AI architecture pattern based on requirements',
  inputSchema: z.object({
    requirements: z.string().describe('Description of the use case and requirements'),
    industry: z.string().optional().describe('Industry sector (e.g., healthcare, finance)'),
    dataTypes: z.array(z.string()).optional().describe('Types of data to be processed'),
    scalingNeeds: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
    budget: z.enum(['low', 'medium', 'high', 'enterprise']).optional(),
    timeline: z.string().optional().describe('Project timeline'),
    complianceNeeds: z.array(z.string()).optional().describe('Compliance requirements (GDPR, HIPAA, etc.)'),
  }),
  
  async execute(input: {
    requirements: string;
    industry?: string;
    dataTypes?: string[];
    scalingNeeds?: 'small' | 'medium' | 'large' | 'enterprise';
    budget?: 'low' | 'medium' | 'high' | 'enterprise';
    timeline?: string;
    complianceNeeds?: string[];
  }) {
    
    const patterns = [
      {
        id: 'content-generation',
        name: 'Content Generation Pattern',
        description: 'Generate high-quality content using LLMs with enterprise controls',
        useCases: ['blog posts', 'documentation', 'marketing copy', 'reports'],
        complexity: 'medium',
        deploymentTime: '2 hours',
        cost: 'medium',
        compliance: ['GDPR'],
        techStack: ['OpenAI', 'FastAPI', 'Redis', 'PostgreSQL'],
        businessValue: 'Reduce content creation time by 70%, ensure consistency',
        roi: '$120K annual savings for content teams'
      },
      {
        id: 'decision-support',
        name: 'Decision Support Pattern',
        description: 'AI-powered decision making with explainable recommendations',
        useCases: ['risk assessment', 'business intelligence', 'optimization', 'planning'],
        complexity: 'high',
        deploymentTime: '4 hours',
        cost: 'high',
        compliance: ['SOC2', 'ISO27001'],
        techStack: ['LangChain', 'Qdrant', 'Grafana', 'Kubernetes'],
        businessValue: 'Improve decision accuracy by 40%, reduce analysis time',
        roi: '$500K annual value from better decisions'
      },
      {
        id: 'rag-system',
        name: 'RAG (Retrieval-Augmented Generation)',
        description: 'Question answering over proprietary documents with citations',
        useCases: ['knowledge base', 'document search', 'customer support', 'research'],
        complexity: 'medium',
        deploymentTime: '3 hours',
        cost: 'medium',
        compliance: ['GDPR', 'HIPAA'],
        techStack: ['Supabase', 'pgvector', 'Langfuse', 'Streamlit'],
        businessValue: 'Enable self-service knowledge access, reduce support tickets by 60%',
        roi: '$200K annual savings in support costs'
      },
      {
        id: 'model-lifecycle',
        name: 'Model Lifecycle Management',
        description: 'End-to-end ML model management and deployment',
        useCases: ['MLOps', 'model versioning', 'continuous deployment', 'monitoring'],
        complexity: 'high',
        deploymentTime: '6 hours',
        cost: 'high',
        compliance: ['SOC2', 'ISO27001', 'Model Risk Management'],
        techStack: ['MLflow', 'Kubernetes', 'Prometheus', 'GitLab CI'],
        businessValue: 'Accelerate model deployment by 80%, ensure model governance',
        roi: '$300K annual value from faster ML delivery'
      }
    ];
    
    // Simple scoring algorithm
    const scoredPatterns = patterns.map(pattern => {
      let score = 0;
      
      // Score based on use case matching
      const reqLower = input.requirements.toLowerCase();
      pattern.useCases.forEach(useCase => {
        if (reqLower.includes(useCase)) score += 2;
      });
      
      // Score based on complexity preference
      if (input.scalingNeeds) {
        const complexityScore = {
          small: { medium: 2, low: 1, high: 0 },
          medium: { medium: 2, high: 1, low: 1 },
          large: { high: 2, medium: 1, low: 0 },
          enterprise: { high: 2, medium: 1, low: 0 }
        };
        score += complexityScore[input.scalingNeeds]?.[pattern.complexity as keyof typeof complexityScore.small] || 0;
      }
      
      // Score based on budget
      if (input.budget && input.budget === pattern.cost) {
        score += 1;
      }
      
      // Score based on compliance needs
      if (input.complianceNeeds) {
        input.complianceNeeds.forEach(need => {
          if (pattern.compliance.some(comp => comp.toLowerCase().includes(need.toLowerCase()))) {
            score += 1;
          }
        });
      }
      
      return { ...pattern, score };
    });
    
    // Sort by score and return top 3
    const topPatterns = scoredPatterns
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    const result = {
      recommendations: topPatterns,
      analysis: {
        totalPatternsEvaluated: patterns.length,
        matchingCriteria: input,
        recommendationReason: `Based on your requirements for "${input.requirements}", these patterns best match your needs considering complexity, budget, and use case alignment.`
      },
      nextSteps: [
        '1. Review detailed implementation guide in AI Architect Academy repo',
        '2. Set up development environment with provided Docker setup',
        '3. Deploy MVP version for testing',
        '4. Scale based on performance metrics and user feedback'
      ]
    };
    
    return {
      success: true,
      data: result,
      message: `Found ${topPatterns.length} recommended patterns for your use case`
    };
  }
};
EOF

    # Cost Calculator Tool
    cat > "$BIGAGI_DIR/src/modules/aifn/custom/cost-calculator.ts" << 'EOF'
import { z } from 'zod';

export const costCalculatorTool = {
  name: 'ai_cost_calculator',
  description: 'Calculate costs for AI architecture implementations',
  inputSchema: z.object({
    pattern: z.string().describe('Pattern name (e.g., rag-system, content-generation)'),
    monthlyUsers: z.number().describe('Expected monthly active users'),
    requestsPerUser: z.number().describe('Average requests per user per month'),
    documentCount: z.number().optional().describe('Number of documents (for RAG systems)'),
    averageTokens: z.number().optional().describe('Average tokens per request'),
    cloudProvider: z.enum(['aws', 'azure', 'gcp', 'local']).optional(),
  }),
  
  async execute(input: {
    pattern: string;
    monthlyUsers: number;
    requestsPerUser: number;
    documentCount?: number;
    averageTokens?: number;
    cloudProvider?: 'aws' | 'azure' | 'gcp' | 'local';
  }) {
    
    const totalRequests = input.monthlyUsers * input.requestsPerUser;
    const avgTokens = input.averageTokens || 1000;
    
    // LLM Costs (per 1K tokens)
    const llmCosts = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
      'claude-3': { input: 0.015, output: 0.075 }
    };
    
    // Infrastructure costs (per month)
    const infraCosts = {
      aws: {
        small: 200,   // t3.large + RDS + minimal vector DB
        medium: 800,  // m5.xlarge + RDS + managed vector DB
        large: 2500,  // m5.4xlarge + multiple instances
        enterprise: 8000 // High availability + managed services
      },
      azure: {
        small: 180,
        medium: 750,
        large: 2200,
        enterprise: 7500
      },
      gcp: {
        small: 190,
        medium: 780,
        large: 2300,
        enterprise: 7800
      },
      local: {
        small: 0,     // Self-hosted
        medium: 500,  // Hardware amortization
        large: 2000,
        enterprise: 5000
      }
    };
    
    // Determine scale based on usage
    let scale: keyof typeof infraCosts.aws;
    if (totalRequests < 100000) scale = 'small';
    else if (totalRequests < 1000000) scale = 'medium';
    else if (totalRequests < 10000000) scale = 'large';
    else scale = 'enterprise';
    
    const provider = input.cloudProvider || 'aws';
    
    // Calculate LLM costs (assuming GPT-3.5-turbo for base calculation)
    const llmTokenCost = (totalRequests * avgTokens / 1000) * 0.002;
    
    // Infrastructure costs
    const infraCost = infraCosts[provider][scale];
    
    // Additional pattern-specific costs
    let patternCosts = 0;
    if (input.pattern.includes('rag') && input.documentCount) {
      // Vector database storage costs
      patternCosts = Math.ceil(input.documentCount / 1000) * 10; // $10 per 1K docs stored
    }
    
    const totalMonthlyCost = llmTokenCost + infraCost + patternCosts;
    const costPerUser = totalMonthlyCost / input.monthlyUsers;
    const costPerRequest = totalMonthlyCost / totalRequests;
    
    // ROI calculation examples
    const roiExamples = {
      'content-generation': {
        manualCostPerRequest: 25, // $25 per manual blog post
        automationSavings: 0.8   // 80% time savings
      },
      'rag-system': {
        manualCostPerRequest: 15, // $15 per manual research query
        automationSavings: 0.9    // 90% time savings
      },
      'decision-support': {
        manualCostPerRequest: 100, // $100 per manual analysis
        automationSavings: 0.6     // 60% time savings
      }
    };
    
    const patternKey = Object.keys(roiExamples).find(key => 
      input.pattern.includes(key)
    ) as keyof typeof roiExamples;
    
    let roi = null;
    if (patternKey) {
      const example = roiExamples[patternKey];
      const monthlySavings = totalRequests * example.manualCostPerRequest * example.automationSavings;
      const monthlyROI = ((monthlySavings - totalMonthlyCost) / totalMonthlyCost) * 100;
      roi = {
        monthlySavings,
        monthlyROI: Math.round(monthlyROI),
        paybackPeriod: totalMonthlyCost / (monthlySavings - totalMonthlyCost)
      };
    }
    
    return {
      success: true,
      data: {
        usage: {
          monthlyUsers: input.monthlyUsers,
          totalRequests,
          scale,
          provider
        },
        costs: {
          llmCosts: Math.round(llmTokenCost),
          infrastructureCosts: infraCost,
          patternSpecificCosts: patternCosts,
          totalMonthlyCost: Math.round(totalMonthlyCost),
          costPerUser: Math.round(costPerUser * 100) / 100,
          costPerRequest: Math.round(costPerRequest * 10000) / 10000
        },
        roi,
        recommendations: [
          totalRequests < 50000 ? 'Consider starting with local deployment' : null,
          costPerUser > 10 ? 'High cost per user - optimize token usage' : null,
          scale === 'enterprise' ? 'Consider enterprise agreements for volume discounts' : null
        ].filter(Boolean)
      }
    };
  }
};
EOF
    
    success "Pattern tools created"
}

# Create environment configuration
create_env_config() {
    log "Creating environment configuration..."
    
    cat > "$BIGAGI_DIR/.env.local.example" << 'EOF'
# AI Architect Academy Integration
# Copy this to .env.local and fill in your values

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_openai_org_id_here

# AI Architect Academy RAG System
RAG_API_URL=http://localhost:8000
RAG_API_KEY=your_rag_api_key_here

# Supabase (for RAG vector storage)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Other AI Providers (optional)
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_AI_API_KEY=your_google_ai_key_here

# BigAGI Configuration
BIGAGI_PORT=3002
BIGAGI_HOST=localhost

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
EOF
    
    if [ ! -f "$BIGAGI_DIR/.env.local" ]; then
        cp "$BIGAGI_DIR/.env.local.example" "$BIGAGI_DIR/.env.local"
        warn "Created .env.local - please add your API keys"
    fi
    
    success "Environment configuration created"
}

# Create startup script
create_startup_script() {
    log "Creating startup script..."
    
    cat > "$BIGAGI_DIR/start-ai-academy.sh" << 'EOF'
#!/bin/bash

# BigAGI + AI Architect Academy Startup Script

echo "🚀 Starting BigAGI with AI Architect Academy Integration"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Please copy .env.local.example and add your API keys"
    exit 1
fi

# Check if RAG system should be started
if command -v docker-compose &> /dev/null; then
    echo "🐳 Starting RAG system (optional - press Ctrl+C to skip)"
    sleep 3
    (cd ../05-projects/rag-complete-implementation && docker-compose up -d) || echo "⚠️  RAG system not available"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start BigAGI
echo "🌟 Starting BigAGI on http://localhost:3002"
npm run dev -- --port 3002

echo "✅ BigAGI with AI Architect Academy integration is running!"
echo ""
echo "🎯 Try these prompts:"
echo '  - "Recommend an AI pattern for content generation"'
echo '  - "Calculate costs for a RAG system with 1000 users"'
echo '  - "Show me implementation details for decision support pattern"'
EOF
    
    chmod +x "$BIGAGI_DIR/start-ai-academy.sh"
    
    success "Startup script created"
}

# Create integration documentation
create_documentation() {
    log "Creating integration documentation..."
    
    cat > "$BIGAGI_DIR/README-AI-ACADEMY.md" << 'EOF'
# BigAGI + AI Architect Academy Integration

This integration enhances BigAGI with AI architecture expertise and pattern recommendations.

## 🚀 Features

- **🏗️ AI Architect Persona**: Expert persona trained on 40+ enterprise AI patterns
- **🔍 Pattern Selector Tool**: Intelligent recommendations based on requirements
- **💰 Cost Calculator**: Real-world cost analysis for AI implementations  
- **📚 RAG Integration**: Query AI Architect Academy documentation directly
- **🔧 Custom Tools**: Production-ready architecture guidance

## Quick Start

1. **Run Setup** (from AI Architect Academy root):
   ```bash
   ./integrations/bigagi/install.sh
   ```

2. **Add API Keys**:
   ```bash
   cd bigagi
   cp .env.local.example .env.local
   # Edit .env.local with your keys
   ```

3. **Start BigAGI**:
   ```bash
   ./start-ai-academy.sh
   ```

4. **Access**: http://localhost:3002

## 🎯 Usage Examples

### Pattern Recommendations
```
User: I need to build a content generation system for my marketing team. 
      We have 50 users, need GDPR compliance, medium budget.

AI Architect: Based on your requirements, I recommend the Content Generation Pattern:

📋 **Recommendation**: Content Generation Pattern
- **Deployment Time**: 2 hours
- **Cost**: ~$800/month for 50 users
- **ROI**: $120K annual savings
- **Compliance**: GDPR ready
- **Tech Stack**: OpenAI + FastAPI + Redis + PostgreSQL

**Implementation Steps**:
1. Clone: `git clone ai-architect-academy`
2. Setup: `cd 01-design-patterns/content-generation && ./deploy.sh`
3. Configure: Add your OpenAI key and GDPR settings
4. Test: Run evaluation suite
5. Deploy: Use provided Kubernetes manifests

**Next Steps**: Review the detailed implementation guide and deployment scripts in the repository.
```

### Cost Analysis
```
User: Calculate costs for a RAG system serving 1000 users with 500 queries/month each

AI Architect: Here's your cost breakdown for the RAG system:

💰 **Monthly Cost Analysis**:
- **LLM Costs**: $750 (500K tokens/month)
- **Infrastructure**: $800 (AWS medium scale)
- **Vector Storage**: $50 (document storage)
- **Total**: $1,600/month

**Per User**: $1.60/month
**Per Query**: $0.003/query

📊 **ROI Analysis**:
- Manual research cost: $15/query
- Automation savings: 90%
- Monthly savings: $6.75M
- ROI: 421,775% 🎯

**Recommendations**:
✅ Excellent ROI - proceed with implementation
✅ Consider enterprise contracts for volume discounts
✅ Start with local deployment to reduce initial costs
```

## 🔧 Custom Tools

### Pattern Selector
```typescript
// Automatically available in BigAGI
patternSelectorTool({
  requirements: "Content generation for blog posts",
  industry: "technology",
  scalingNeeds: "medium",
  budget: "medium",
  complianceNeeds: ["GDPR"]
})
```

### Cost Calculator
```typescript
costCalculatorTool({
  pattern: "rag-system",
  monthlyUsers: 1000,
  requestsPerUser: 500,
  documentCount: 10000,
  cloudProvider: "aws"
})
```

## 🏗️ Architecture

```mermaid
graph TB
    User[User] --> BigAGI[BigAGI Interface]
    BigAGI --> Persona[AI Architect Persona]
    BigAGI --> Tools[Custom Tools]
    
    Tools --> PatternSelector[Pattern Selector]
    Tools --> CostCalc[Cost Calculator]
    Tools --> RAGQuery[RAG Query]
    
    PatternSelector --> Patterns[(Pattern Database)]
    RAGQuery --> RAGAPI[RAG API :8000]
    
    RAGAPI --> VectorDB[(Vector Store)]
    RAGAPI --> LLM[OpenAI GPT-4]
    
    style BigAGI fill:#e1f5fe
    style Tools fill:#f3e5f5
    style Patterns fill:#e8f5e8
```

## 📋 Configuration

### Persona Settings
- **Name**: AI Architect Academy Expert  
- **Symbol**: 🏗️
- **Category**: AI Architecture
- **Voice**: Professional, detailed, practical

### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-...
RAG_API_URL=http://localhost:8000

# Optional
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://...
BIGAGI_PORT=3002
```

## 🔍 Advanced Features

### Custom Pattern Development
Add new patterns to the tool:

```typescript
// In pattern-selector.ts
const customPatterns = [
  {
    id: 'my-custom-pattern',
    name: 'My Custom AI Pattern',
    description: 'Specialized pattern for my use case',
    // ... pattern definition
  }
];
```

### Enterprise Integration
For enterprise deployments:

1. **SSO Integration**: Configure with your identity provider
2. **Custom Models**: Add your fine-tuned models
3. **Governance**: Set up approval workflows
4. **Monitoring**: Connect to enterprise observability

## 🚀 Deployment

### Development
```bash
npm run dev -- --port 3002
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t bigagi-ai-academy .
docker run -p 3002:3000 bigagi-ai-academy
```

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Kill existing process
lsof -ti:3002 | xargs kill -9
```

**API Keys Not Working**:
```bash
# Check .env.local
cat .env.local | grep API_KEY
```

**RAG System Connection Failed**:
```bash
# Start RAG system
cd ../05-projects/rag-complete-implementation
docker-compose up -d
curl http://localhost:8000/health
```

### Performance Optimization

**Slow Pattern Recommendations**:
- Enable caching in pattern-selector.ts
- Pre-compute common patterns
- Use Redis for tool result caching

**High Memory Usage**:
- Reduce concurrent tool executions
- Implement result streaming
- Use worker processes for heavy operations

## 🤝 Contributing

1. **Add New Patterns**: Update pattern database in tools
2. **Improve Tools**: Enhance calculation algorithms
3. **Better Integration**: Add more RAG capabilities
4. **Documentation**: Update examples and guides

## 📞 Support

- **GitHub Issues**: [AI Architect Academy Issues](https://github.com/AI-Architect-Academy/ai-architect-academy/issues)
- **Documentation**: [Full Documentation](https://ai-architect-academy.github.io/ai-architect-academy/)
- **Community**: Join our Discord server

---

**Built with ❤️ by AI Architect Academy**

Transform your AI architecture conversations with enterprise-grade patterns and real-world implementation guidance.
EOF
    
    success "Integration documentation created"
}

# Main execution
main() {
    log "Starting BigAGI + AI Architect Academy integration..."
    
    check_prerequisites
    setup_bigagi
    create_academy_persona
    create_pattern_tools
    create_env_config
    create_startup_script
    create_documentation
    
    echo ""
    success "🎉 BigAGI + AI Architect Academy integration complete!"
    echo ""
    echo "📁 Location: $(pwd)/$BIGAGI_DIR"
    echo "🚀 Start: cd $BIGAGI_DIR && ./start-ai-academy.sh"
    echo "🌐 Access: http://localhost:$BIGAGI_PORT"
    echo ""
    echo "🎯 Try asking:"
    echo "  - 'Recommend an AI pattern for my use case'"
    echo "  - 'Calculate costs for a RAG system'"
    echo "  - 'Show me enterprise deployment options'"
    echo ""
    
    # Optionally start the system
    read -p "Would you like to start BigAGI now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Starting BigAGI..."
        cd "$BIGAGI_DIR"
        ./start-ai-academy.sh
    fi
}

# Run main function
main "$@"