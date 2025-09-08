#!/bin/bash

# AI Architect Academy - Quick Start Script
# Run this to set up your development environment

set -e

echo "🚀 AI Architect Academy - Quick Start Setup"
echo "==========================================="

# Check Python version
echo "📍 Checking Python version..."
python_version=$(python3 --version 2>&1 | grep -Po '(?<=Python )\d+\.\d+')
required_version="3.9"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then 
    echo "❌ Python $required_version or higher required. Found: $python_version"
    exit 1
fi
echo "✅ Python $python_version found"

# Check Docker
echo "📍 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker found"

# Check Git
echo "📍 Checking Git..."
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git first."
    exit 1
fi
echo "✅ Git found"

# Create virtual environment
echo "📍 Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install base requirements
echo "📍 Installing base requirements..."
pip install --upgrade pip
pip install black pylint mypy pytest pytest-cov streamlit langchain openai python-dotenv

# Create necessary directories
echo "📍 Creating project structure..."
mkdir -p .github/workflows
mkdir -p tests
mkdir -p docs/assets
mkdir -p 05-projects/new-project-template

# Create .env template
echo "📍 Creating .env template..."
cat > .env.example << 'EOF'
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (for RAG)
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# Langfuse Configuration (for observability)
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key_here
LANGFUSE_SECRET_KEY=your_langfuse_secret_key_here
LANGFUSE_HOST=https://cloud.langfuse.com

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here

# Environment
ENVIRONMENT=development
DEBUG=true
EOF

# Copy to .env if doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Created .env file - please add your API keys"
fi

# Install pre-commit hooks
echo "📍 Setting up pre-commit hooks..."
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run black formatter
black --check .
# Run tests
pytest tests/ -q
EOF
chmod +x .git/hooks/pre-commit

# Create initial