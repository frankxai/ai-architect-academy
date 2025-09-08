# RAG Complete Implementation - Makefile
# Convenient commands for development and deployment

.PHONY: help install dev-install test lint format clean docker-build docker-run setup-db ingest-sample evaluate

# Default target
help:
	@echo "RAG Complete Implementation - Available Commands:"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  install          Install production dependencies"
	@echo "  dev-install      Install development dependencies"
	@echo "  setup-db         Initialize database schema"
	@echo ""
	@echo "Development:"
	@echo "  test             Run all tests"
	@echo "  test-fast        Run tests without slow tests"
	@echo "  lint             Run linting checks"
	@echo "  format           Format code with black and isort"
	@echo "  clean            Clean up temporary files"
	@echo ""
	@echo "Data & Evaluation:"
	@echo "  ingest-sample    Ingest sample documents"
	@echo "  evaluate         Run evaluation tests"
	@echo "  benchmark        Run performance benchmark"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build     Build Docker image"
	@echo "  docker-run       Run with docker-compose"
	@echo "  docker-stop      Stop docker containers"
	@echo "  docker-clean     Clean up docker resources"
	@echo ""
	@echo "Application:"
	@echo "  run              Run Streamlit app locally"
	@echo "  check-env        Check environment variables"
	@echo ""

# Installation commands
install:
	pip install -r requirements.txt

dev-install:
	pip install -r requirements.txt
	pip install pytest pytest-asyncio pytest-cov black isort mypy

# Database setup
setup-db:
	python scripts/setup_database.py

# Testing commands
test:
	pytest tests/ -v

test-fast:
	pytest tests/ -v -m "not slow"

test-cov:
	pytest tests/ --cov=src/rag_system --cov-report=html --cov-report=term

# Code quality
lint:
	@echo "Running black..."
	black --check src/ tests/ scripts/
	@echo "Running isort..."
	isort --check-only src/ tests/ scripts/
	@echo "Running mypy..."
	mypy src/

format:
	@echo "Formatting with black..."
	black src/ tests/ scripts/
	@echo "Sorting imports with isort..."
	isort src/ tests/ scripts/

# Data operations
ingest-sample:
	python scripts/ingest_documents.py --directory data/sample --recursive --output results/sample_ingestion.json

evaluate:
	python scripts/run_evaluation.py evaluate --output results/evaluation_results.json --verbose

benchmark:
	python scripts/run_evaluation.py benchmark --queries 50 --output results/benchmark_results.json

# Docker operations
docker-build:
	docker build -t rag-complete-implementation .

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

docker-clean:
	docker-compose down -v
	docker system prune -f

# Application
run:
	streamlit run ui/streamlit_app.py

check-env:
	python scripts/ingest_documents.py --check-env

# Cleanup
clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +

# Create results directory
results:
	mkdir -p results

# Full setup for new development environment
dev-setup: dev-install setup-db ingest-sample
	@echo "Development environment setup complete!"
	@echo "Run 'make run' to start the application"

# Production deployment preparation
prod-setup: install
	@echo "Checking environment variables..."
	@python scripts/ingest_documents.py --check-env
	@echo "Testing database connection..."
	@python scripts/setup_database.py
	@echo "Production setup complete!"

# CI/CD pipeline commands
ci-test: dev-install test lint
	@echo "CI pipeline completed successfully"

# Health check
health:
	@echo "Running system health checks..."
	@python -c "import sys; print(f'Python version: {sys.version}')"
	@python -c "import openai; print('OpenAI package: OK')"
	@python -c "import supabase; print('Supabase package: OK')"
	@python -c "import streamlit; print('Streamlit package: OK')"
	@echo "Health check completed"