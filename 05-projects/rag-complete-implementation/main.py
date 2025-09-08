#!/usr/bin/env python3
"""
RAG Complete Implementation - CLI Interface
Production-ready command-line interface for RAG operations.
"""
import asyncio
import click
import json
import time
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.panel import Panel
from rich.syntax import Syntax
import yaml

from src.rag_system.rag_engine import RAGEngine
from config.settings import settings

console = Console()
logger = logging.getLogger(__name__)


class RAGCLIError(Exception):
    """Custom exception for CLI errors."""
    pass


@click.group()
@click.option('--verbose', '-v', is_flag=True, help='Enable verbose logging')
@click.option('--config', '-c', type=click.Path(exists=True), help='Configuration file path')
@click.pass_context
def cli(ctx, verbose: bool, config: Optional[str]):
    """RAG Complete Implementation CLI - Production-ready RAG operations."""
    ctx.ensure_object(dict)
    
    # Configure logging
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Load custom config if provided
    if config:
        with open(config, 'r') as f:
            custom_config = yaml.safe_load(f)
            # Override settings with custom config
            # Implementation would depend on your settings structure
    
    ctx.obj['verbose'] = verbose
    ctx.obj['config'] = config


@cli.command()
@click.pass_context
def init(ctx):
    """Initialize the RAG system database and components."""
    console.print("[bold blue]Initializing RAG Complete Implementation...[/bold blue]")
    
    async def _init():
        try:
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Initializing RAG engine...", total=None)
                
                rag_engine = RAGEngine()
                await rag_engine.initialize()
                
                progress.update(task, description="✅ RAG engine initialized successfully")
                
                # Test basic functionality
                progress.update(task, description="🧪 Running system tests...")
                stats = await rag_engine.get_statistics()
                
                console.print(Panel.fit(
                    f"[green]✅ Initialization Complete![/green]\n\n"
                    f"Vector Store: {stats.get('vector_store_status', 'Unknown')}\n"
                    f"Documents: {stats.get('document_count', 0)}\n"
                    f"Embeddings: {stats.get('embedding_count', 0)}",
                    title="System Status"
                ))
                
        except Exception as e:
            console.print(f"[red]❌ Initialization failed: {e}[/red]")
            raise RAGCLIError(f"Initialization failed: {e}")
    
    asyncio.run(_init())


@cli.command()
@click.argument('query', type=str)
@click.option('--max-results', '-n', default=5, help='Maximum number of results')
@click.option('--threshold', '-t', default=0.7, help='Similarity threshold')
@click.option('--no-sources', is_flag=True, help='Exclude source documents')
@click.option('--output', '-o', type=click.Choice(['json', 'table', 'text']), default='text')
@click.pass_context
def query(ctx, query: str, max_results: int, threshold: float, no_sources: bool, output: str):
    """Execute a RAG query and display results."""
    
    async def _query():
        try:
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task(f"Processing query: {query[:50]}...", total=None)
                
                rag_engine = RAGEngine()
                await rag_engine.initialize()
                
                start_time = time.time()
                result = await rag_engine.query(
                    query=query,
                    max_results=max_results,
                    similarity_threshold=threshold,
                    include_sources=not no_sources
                )
                end_time = time.time()
                
                progress.update(task, description=f"✅ Query completed in {end_time - start_time:.2f}s")
            
            # Display results based on output format
            if output == 'json':
                console.print(json.dumps(result.__dict__, indent=2))
            
            elif output == 'table':
                table = Table(title=f"Query Results: {query}")
                table.add_column("Answer", style="green")
                table.add_column("Response Time", style="blue")
                table.add_column("Tokens Used", style="yellow")
                
                table.add_row(
                    result.answer,
                    f"{result.response_time:.2f}s",
                    str(result.token_usage.get('total_tokens', 'N/A'))
                )
                
                console.print(table)
                
                if result.sources and not no_sources:
                    sources_table = Table(title="Sources", show_header=True)
                    sources_table.add_column("ID", style="cyan")
                    sources_table.add_column("Content", style="white")
                    sources_table.add_column("Score", style="green")
                    
                    for i, source in enumerate(result.sources):
                        sources_table.add_row(
                            str(i + 1),
                            source.get('content', '')[:100] + '...',
                            f"{source.get('similarity_score', 0):.3f}"
                        )
                    
                    console.print(sources_table)
            
            else:  # text format
                console.print(Panel.fit(
                    f"[bold green]Answer:[/bold green]\n{result.answer}\n\n"
                    f"[bold blue]Response Time:[/bold blue] {result.response_time:.2f}s\n"
                    f"[bold yellow]Tokens Used:[/bold yellow] {result.token_usage.get('total_tokens', 'N/A')}",
                    title=f"Query: {query}"
                ))
                
                if result.sources and not no_sources:
                    console.print("\n[bold cyan]Sources:[/bold cyan]")
                    for i, source in enumerate(result.sources, 1):
                        console.print(f"\n{i}. [green]{source.get('content', '')[:200]}...[/green]")
                        console.print(f"   Similarity: {source.get('similarity_score', 0):.3f}")
                
        except Exception as e:
            console.print(f"[red]❌ Query failed: {e}[/red]")
            raise RAGCLIError(f"Query failed: {e}")
    
    asyncio.run(_query())


@cli.command()
@click.argument('files', nargs=-1, type=click.Path(exists=True), required=True)
@click.option('--batch-size', '-b', default=50, help='Batch size for processing')
@click.option('--force', is_flag=True, help='Force re-ingestion of existing documents')
@click.pass_context
def ingest(ctx, files: tuple, batch_size: int, force: bool):
    """Ingest documents into the RAG system."""
    
    async def _ingest():
        try:
            file_paths = []
            for file_pattern in files:
                path = Path(file_pattern)
                if path.is_file():
                    file_paths.append(str(path))
                elif path.is_dir():
                    # Add all supported files in directory
                    for ext in ['.txt', '.md', '.pdf', '.docx']:
                        file_paths.extend([str(p) for p in path.glob(f'*{ext}')])
            
            if not file_paths:
                console.print("[yellow]⚠️ No files found to ingest[/yellow]")
                return
            
            console.print(f"[blue]📄 Found {len(file_paths)} files to ingest[/blue]")
            
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Initializing RAG engine...", total=None)
                
                rag_engine = RAGEngine()
                await rag_engine.initialize()
                
                progress.update(task, description="📚 Ingesting documents...")
                
                start_time = time.time()
                result = await rag_engine.ingest_documents(
                    file_paths=file_paths,
                    batch_size=batch_size
                )
                end_time = time.time()
                
                progress.update(task, description=f"✅ Ingestion completed in {end_time - start_time:.2f}s")
            
            console.print(Panel.fit(
                f"[green]✅ Ingestion Complete![/green]\n\n"
                f"Files processed: {result.get('processed_files', 0)}\n"
                f"Documents created: {result.get('document_count', 0)}\n"
                f"Chunks created: {result.get('chunk_count', 0)}\n"
                f"Processing time: {end_time - start_time:.2f}s",
                title="Ingestion Results"
            ))
                
        except Exception as e:
            console.print(f"[red]❌ Ingestion failed: {e}[/red]")
            raise RAGCLIError(f"Ingestion failed: {e}")
    
    asyncio.run(_ingest())


@cli.command()
@click.option('--format', '-f', type=click.Choice(['json', 'table']), default='table')
@click.pass_context
def stats(ctx, format: str):
    """Display RAG system statistics."""
    
    async def _stats():
        try:
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Fetching system statistics...", total=None)
                
                rag_engine = RAGEngine()
                await rag_engine.initialize()
                
                stats = await rag_engine.get_statistics()
                
                progress.update(task, description="✅ Statistics retrieved")
            
            if format == 'json':
                console.print(json.dumps(stats, indent=2))
            else:
                table = Table(title="RAG System Statistics")
                table.add_column("Metric", style="cyan")
                table.add_column("Value", style="green")
                
                for key, value in stats.items():
                    table.add_row(key.replace('_', ' ').title(), str(value))
                
                console.print(table)
                
        except Exception as e:
            console.print(f"[red]❌ Failed to get statistics: {e}[/red]")
            raise RAGCLIError(f"Failed to get statistics: {e}")
    
    asyncio.run(_stats())


@cli.command()
@click.argument('test_file', type=click.Path(exists=True))
@click.option('--output-report', '-o', type=click.Path(), help='Output evaluation report')
@click.pass_context
def evaluate(ctx, test_file: str, output_report: Optional[str]):
    """Evaluate RAG system performance with test queries."""
    
    async def _evaluate():
        try:
            # Load test queries
            with open(test_file, 'r') as f:
                if test_file.endswith('.json'):
                    test_data = json.load(f)
                elif test_file.endswith(('.yml', '.yaml')):
                    test_data = yaml.safe_load(f)
                else:
                    # Assume plain text, one query per line
                    test_data = {'queries': f.read().strip().split('\n')}
            
            queries = test_data.get('queries', [])
            expected_answers = test_data.get('expected_answers', [])
            
            console.print(f"[blue]🧪 Running evaluation with {len(queries)} test queries[/blue]")
            
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task("Initializing evaluation...", total=None)
                
                rag_engine = RAGEngine()
                await rag_engine.initialize()
                
                progress.update(task, description="🔬 Running evaluation...")
                
                start_time = time.time()
                results = await rag_engine.evaluate(
                    test_queries=queries,
                    expected_answers=expected_answers if expected_answers else None
                )
                end_time = time.time()
                
                progress.update(task, description=f"✅ Evaluation completed in {end_time - start_time:.2f}s")
            
            # Display results
            console.print(Panel.fit(
                f"[green]✅ Evaluation Complete![/green]\n\n"
                f"Queries tested: {len(queries)}\n"
                f"Average response time: {results.get('avg_response_time', 0):.2f}s\n"
                f"Average relevance score: {results.get('avg_relevance_score', 0):.3f}\n"
                f"Success rate: {results.get('success_rate', 0):.1%}",
                title="Evaluation Results"
            ))
            
            # Save report if requested
            if output_report:
                with open(output_report, 'w') as f:
                    json.dump(results, f, indent=2)
                console.print(f"[green]📊 Report saved to {output_report}[/green]")
                
        except Exception as e:
            console.print(f"[red]❌ Evaluation failed: {e}[/red]")
            raise RAGCLIError(f"Evaluation failed: {e}")
    
    asyncio.run(_evaluate())


@cli.command()
@click.option('--host', default='127.0.0.1', help='Server host')
@click.option('--port', default=8000, help='Server port')
@click.option('--reload', is_flag=True, help='Enable auto-reload')
@click.pass_context
def serve(ctx, host: str, port: int, reload: bool):
    """Start the RAG API server."""
    import uvicorn
    
    console.print(f"[blue]🚀 Starting RAG API server on {host}:{port}[/blue]")
    console.print(f"[cyan]📖 API documentation available at: http://{host}:{port}/docs[/cyan]")
    
    try:
        uvicorn.run(
            "api:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
    except KeyboardInterrupt:
        console.print("\n[yellow]👋 Server stopped by user[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Server failed to start: {e}[/red]")
        raise RAGCLIError(f"Server failed to start: {e}")


@cli.command()
@click.pass_context
def config(ctx):
    """Show current configuration."""
    config_dict = {
        'api': {
            'host': settings.api.host,
            'port': settings.api.port,
            'auth_enabled': settings.api.auth_enabled
        },
        'openai': {
            'model': settings.openai.model,
            'max_tokens': settings.openai.max_tokens
        },
        'vector_store': {
            'provider': settings.vector_store.provider,
            'collection_name': settings.vector_store.collection_name
        }
    }
    
    syntax = Syntax(yaml.dump(config_dict, default_flow_style=False), "yaml", theme="monokai")
    console.print(Panel.fit(syntax, title="Current Configuration"))


@cli.command()
@click.pass_context
def version(ctx):
    """Show version information."""
    console.print(Panel.fit(
        "[bold blue]RAG Complete Implementation[/bold blue]\n"
        "Version: 1.0.0\n"
        "Python: 3.9+\n"
        "License: MIT",
        title="Version Information"
    ))


if __name__ == '__main__':
    try:
        cli()
    except RAGCLIError as e:
        console.print(f"[red]Error: {e}[/red]")
        exit(1)
    except KeyboardInterrupt:
        console.print("\n[yellow]👋 Goodbye![/yellow]")
        exit(0)