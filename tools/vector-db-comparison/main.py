#!/usr/bin/env python3
"""
Vector Database Comparison Tool
Comprehensive benchmarking and comparison of vector databases for AI applications.
"""
import asyncio
import time
import json
import logging
import statistics
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from pathlib import Path
import click
import numpy as np
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, MofNCompleteColumn
from rich.panel import Panel
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Vector DB clients
try:
    import qdrant_client
    from qdrant_client.models import VectorParams, Distance
    QDRANT_AVAILABLE = True
except ImportError:
    QDRANT_AVAILABLE = False

try:
    import weaviate
    WEAVIATE_AVAILABLE = True
except ImportError:
    WEAVIATE_AVAILABLE = False

try:
    import pinecone
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

try:
    import chromadb
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False

try:
    import psycopg2
    from pgvector.psycopg2 import register_vector
    PGVECTOR_AVAILABLE = True
except ImportError:
    PGVECTOR_AVAILABLE = False

console = Console()
logger = logging.getLogger(__name__)

@dataclass
class BenchmarkResult:
    """Results from a single benchmark test."""
    database: str
    operation: str
    duration: float
    throughput: float
    memory_usage: float
    cpu_usage: float
    success_rate: float
    error_count: int
    metadata: Dict[str, Any]

@dataclass
class ComparisonMetrics:
    """Comprehensive comparison metrics."""
    setup_time: float
    insert_performance: BenchmarkResult
    query_performance: BenchmarkResult
    update_performance: BenchmarkResult
    delete_performance: BenchmarkResult
    memory_efficiency: float
    disk_usage: float
    cost_estimate: float
    ease_of_use_score: int  # 1-10
    documentation_score: int  # 1-10
    community_score: int  # 1-10

class VectorDatabaseInterface:
    """Abstract interface for vector database implementations."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.name = "Base"
        self.client = None
        
    async def setup(self) -> float:
        """Setup database and return setup time."""
        raise NotImplementedError
        
    async def insert_vectors(self, vectors: List[List[float]], ids: List[str], 
                           metadata: List[Dict[str, Any]] = None) -> BenchmarkResult:
        """Insert vectors and return benchmark results."""
        raise NotImplementedError
        
    async def query_vectors(self, query_vector: List[float], top_k: int = 10) -> BenchmarkResult:
        """Query vectors and return benchmark results."""
        raise NotImplementedError
        
    async def update_vectors(self, ids: List[str], vectors: List[List[float]]) -> BenchmarkResult:
        """Update vectors and return benchmark results."""
        raise NotImplementedError
        
    async def delete_vectors(self, ids: List[str]) -> BenchmarkResult:
        """Delete vectors and return benchmark results."""
        raise NotImplementedError
        
    async def cleanup(self):
        """Clean up resources."""
        pass

class QdrantDatabase(VectorDatabaseInterface):
    """Qdrant vector database implementation."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.name = "Qdrant"
        self.collection_name = config.get("collection_name", "benchmark_collection")
        
    async def setup(self) -> float:
        """Setup Qdrant client and collection."""
        if not QDRANT_AVAILABLE:
            raise ImportError("Qdrant client not available")
            
        start_time = time.time()
        
        self.client = qdrant_client.QdrantClient(
            host=self.config.get("host", "localhost"),
            port=self.config.get("port", 6333)
        )
        
        # Create collection
        vector_size = self.config.get("vector_size", 384)
        try:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=Distance.COSINE
                )
            )
        except Exception as e:
            if "already exists" not in str(e):
                raise
                
        return time.time() - start_time
        
    async def insert_vectors(self, vectors: List[List[float]], ids: List[str], 
                           metadata: List[Dict[str, Any]] = None) -> BenchmarkResult:
        """Insert vectors into Qdrant."""
        start_time = time.time()
        error_count = 0
        
        try:
            points = []
            for i, (vector, point_id) in enumerate(zip(vectors, ids)):
                payload = metadata[i] if metadata else {}
                points.append({
                    "id": point_id,
                    "vector": vector,
                    "payload": payload
                })
            
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            
            duration = time.time() - start_time
            throughput = len(vectors) / duration
            
            return BenchmarkResult(
                database=self.name,
                operation="insert",
                duration=duration,
                throughput=throughput,
                memory_usage=0,  # Would need system monitoring
                cpu_usage=0,
                success_rate=1.0,
                error_count=error_count,
                metadata={"batch_size": len(vectors)}
            )
            
        except Exception as e:
            logger.error(f"Qdrant insert error: {e}")
            error_count += 1
            raise
            
    async def query_vectors(self, query_vector: List[float], top_k: int = 10) -> BenchmarkResult:
        """Query vectors from Qdrant."""
        start_time = time.time()
        
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k
            )
            
            duration = time.time() - start_time
            throughput = 1 / duration
            
            return BenchmarkResult(
                database=self.name,
                operation="query",
                duration=duration,
                throughput=throughput,
                memory_usage=0,
                cpu_usage=0,
                success_rate=1.0,
                error_count=0,
                metadata={"results_count": len(results), "top_k": top_k}
            )
            
        except Exception as e:
            logger.error(f"Qdrant query error: {e}")
            raise

class ChromaDatabase(VectorDatabaseInterface):
    """ChromaDB implementation."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.name = "ChromaDB"
        self.collection_name = config.get("collection_name", "benchmark_collection")
        
    async def setup(self) -> float:
        """Setup ChromaDB client and collection."""
        if not CHROMA_AVAILABLE:
            raise ImportError("ChromaDB not available")
            
        start_time = time.time()
        
        self.client = chromadb.Client()
        
        try:
            self.collection = self.client.create_collection(
                name=self.collection_name
            )
        except Exception:
            self.collection = self.client.get_collection(
                name=self.collection_name
            )
            
        return time.time() - start_time
        
    async def insert_vectors(self, vectors: List[List[float]], ids: List[str], 
                           metadata: List[Dict[str, Any]] = None) -> BenchmarkResult:
        """Insert vectors into ChromaDB."""
        start_time = time.time()
        
        try:
            self.collection.add(
                embeddings=vectors,
                ids=ids,
                metadatas=metadata if metadata else [{}] * len(vectors)
            )
            
            duration = time.time() - start_time
            throughput = len(vectors) / duration
            
            return BenchmarkResult(
                database=self.name,
                operation="insert",
                duration=duration,
                throughput=throughput,
                memory_usage=0,
                cpu_usage=0,
                success_rate=1.0,
                error_count=0,
                metadata={"batch_size": len(vectors)}
            )
            
        except Exception as e:
            logger.error(f"ChromaDB insert error: {e}")
            raise
            
    async def query_vectors(self, query_vector: List[float], top_k: int = 10) -> BenchmarkResult:
        """Query vectors from ChromaDB."""
        start_time = time.time()
        
        try:
            results = self.collection.query(
                query_embeddings=[query_vector],
                n_results=top_k
            )
            
            duration = time.time() - start_time
            throughput = 1 / duration
            
            return BenchmarkResult(
                database=self.name,
                operation="query",
                duration=duration,
                throughput=throughput,
                memory_usage=0,
                cpu_usage=0,
                success_rate=1.0,
                error_count=0,
                metadata={"results_count": len(results['ids'][0]), "top_k": top_k}
            )
            
        except Exception as e:
            logger.error(f"ChromaDB query error: {e}")
            raise

class PgVectorDatabase(VectorDatabaseInterface):
    """PostgreSQL with pgvector extension implementation."""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.name = "pgvector"
        self.table_name = config.get("table_name", "benchmark_vectors")
        
    async def setup(self) -> float:
        """Setup PostgreSQL connection and table."""
        if not PGVECTOR_AVAILABLE:
            raise ImportError("pgvector not available")
            
        start_time = time.time()
        
        # Connect to PostgreSQL
        self.conn = psycopg2.connect(
            host=self.config.get("host", "localhost"),
            port=self.config.get("port", 5432),
            database=self.config.get("database", "postgres"),
            user=self.config.get("user", "postgres"),
            password=self.config.get("password", "")
        )
        
        register_vector(self.conn)
        
        # Create table
        vector_size = self.config.get("vector_size", 384)
        with self.conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
            cur.execute(f"""
                CREATE TABLE IF NOT EXISTS {self.table_name} (
                    id TEXT PRIMARY KEY,
                    vector vector({vector_size}),
                    metadata JSONB
                )
            """)
            cur.execute(f"CREATE INDEX IF NOT EXISTS {self.table_name}_vector_idx ON {self.table_name} USING ivfflat (vector vector_cosine_ops) WITH (lists = 100)")
            self.conn.commit()
            
        return time.time() - start_time
        
    async def insert_vectors(self, vectors: List[List[float]], ids: List[str], 
                           metadata: List[Dict[str, Any]] = None) -> BenchmarkResult:
        """Insert vectors into PostgreSQL."""
        start_time = time.time()
        
        try:
            with self.conn.cursor() as cur:
                for i, (vector, point_id) in enumerate(zip(vectors, ids)):
                    meta = json.dumps(metadata[i]) if metadata else '{}'
                    cur.execute(
                        f"INSERT INTO {self.table_name} (id, vector, metadata) VALUES (%s, %s, %s) ON CONFLICT (id) DO UPDATE SET vector = EXCLUDED.vector, metadata = EXCLUDED.metadata",
                        (point_id, vector, meta)
                    )
                self.conn.commit()
                
            duration = time.time() - start_time
            throughput = len(vectors) / duration
            
            return BenchmarkResult(
                database=self.name,
                operation="insert",
                duration=duration,
                throughput=throughput,
                memory_usage=0,
                cpu_usage=0,
                success_rate=1.0,
                error_count=0,
                metadata={"batch_size": len(vectors)}
            )
            
        except Exception as e:
            logger.error(f"pgvector insert error: {e}")
            raise
            
    async def query_vectors(self, query_vector: List[float], top_k: int = 10) -> BenchmarkResult:
        """Query vectors from PostgreSQL."""
        start_time = time.time()
        
        try:
            with self.conn.cursor() as cur:
                cur.execute(f"""
                    SELECT id, vector, metadata, 1 - (vector <=> %s) as similarity
                    FROM {self.table_name}
                    ORDER BY vector <=> %s
                    LIMIT %s
                """, (query_vector, query_vector, top_k))
                
                results = cur.fetchall()
                
            duration = time.time() - start_time
            throughput = 1 / duration
            
            return BenchmarkResult(
                database=self.name,
                operation="query",
                duration=duration,
                throughput=throughput,
                memory_usage=0,
                cpu_usage=0,
                success_rate=1.0,
                error_count=0,
                metadata={"results_count": len(results), "top_k": top_k}
            )
            
        except Exception as e:
            logger.error(f"pgvector query error: {e}")
            raise

class VectorDatabaseComparator:
    """Main comparison engine."""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.databases = {}
        self.results = {}
        
    def register_database(self, db_impl: VectorDatabaseInterface):
        """Register a database implementation for testing."""
        self.databases[db_impl.name] = db_impl
        
    def generate_test_vectors(self, count: int, dimension: int) -> List[List[float]]:
        """Generate random test vectors."""
        vectors = []
        for _ in range(count):
            # Generate normalized random vector
            vector = np.random.normal(0, 1, dimension)
            vector = vector / np.linalg.norm(vector)
            vectors.append(vector.tolist())
        return vectors
        
    async def run_comprehensive_benchmark(self) -> Dict[str, ComparisonMetrics]:
        """Run comprehensive benchmark across all registered databases."""
        console.print("[bold blue]🚀 Starting Comprehensive Vector Database Benchmark[/bold blue]")
        
        # Test parameters
        vector_count = self.config.get("vector_count", 10000)
        vector_dimension = self.config.get("vector_dimension", 384)
        query_count = self.config.get("query_count", 100)
        
        # Generate test data
        console.print(f"📊 Generating {vector_count} test vectors with {vector_dimension} dimensions...")
        test_vectors = self.generate_test_vectors(vector_count, vector_dimension)
        test_ids = [f"vec_{i}" for i in range(vector_count)]
        test_metadata = [{"index": i, "category": f"cat_{i % 10}"} for i in range(vector_count)]
        
        # Query vectors
        query_vectors = self.generate_test_vectors(query_count, vector_dimension)
        
        results = {}
        
        for db_name, db_impl in self.databases.items():
            console.print(f"\n[bold cyan]Testing {db_name}...[/bold cyan]")
            
            try:
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    BarColumn(),
                    MofNCompleteColumn(),
                    console=console,
                ) as progress:
                    
                    # Setup
                    task = progress.add_task(f"Setting up {db_name}...", total=5)
                    setup_time = await db_impl.setup()
                    progress.advance(task)
                    
                    # Insert benchmark
                    progress.update(task, description=f"Inserting {vector_count} vectors...")
                    insert_result = await db_impl.insert_vectors(test_vectors, test_ids, test_metadata)
                    progress.advance(task)
                    
                    # Query benchmark
                    progress.update(task, description=f"Running {query_count} queries...")
                    query_times = []
                    query_throughputs = []
                    
                    for i, query_vector in enumerate(query_vectors):
                        query_result = await db_impl.query_vectors(query_vector, top_k=10)
                        query_times.append(query_result.duration)
                        query_throughputs.append(query_result.throughput)
                        
                        if i % 20 == 0:  # Update progress every 20 queries
                            progress.update(task, completed=2 + (i / query_count))
                    
                    # Average query performance
                    avg_query_result = BenchmarkResult(
                        database=db_name,
                        operation="query",
                        duration=statistics.mean(query_times),
                        throughput=statistics.mean(query_throughputs),
                        memory_usage=0,
                        cpu_usage=0,
                        success_rate=1.0,
                        error_count=0,
                        metadata={
                            "query_count": query_count,
                            "p95_latency": statistics.quantiles(query_times, n=20)[18] if len(query_times) > 20 else max(query_times),
                            "p99_latency": statistics.quantiles(query_times, n=100)[98] if len(query_times) > 100 else max(query_times)
                        }
                    )
                    progress.advance(task)
                    
                    # Update benchmark (simplified)
                    progress.update(task, description=f"Testing updates...")
                    update_vectors = self.generate_test_vectors(100, vector_dimension)
                    update_ids = test_ids[:100]
                    update_result = await db_impl.update_vectors(update_ids, update_vectors)
                    progress.advance(task)
                    
                    # Delete benchmark (simplified)
                    progress.update(task, description=f"Testing deletes...")
                    delete_ids = test_ids[:50]
                    delete_result = await db_impl.delete_vectors(delete_ids)
                    progress.advance(task)
                    
                    # Calculate metrics
                    results[db_name] = ComparisonMetrics(
                        setup_time=setup_time,
                        insert_performance=insert_result,
                        query_performance=avg_query_result,
                        update_performance=update_result,
                        delete_performance=delete_result,
                        memory_efficiency=self._calculate_memory_efficiency(db_name),
                        disk_usage=self._estimate_disk_usage(vector_count, vector_dimension),
                        cost_estimate=self._estimate_monthly_cost(db_name, vector_count),
                        ease_of_use_score=self._rate_ease_of_use(db_name),
                        documentation_score=self._rate_documentation(db_name),
                        community_score=self._rate_community(db_name)
                    )
                    
                # Cleanup
                await db_impl.cleanup()
                
            except Exception as e:
                console.print(f"[red]❌ {db_name} benchmark failed: {e}[/red]")
                logger.error(f"Benchmark failed for {db_name}: {e}")
                
        return results
        
    def _calculate_memory_efficiency(self, db_name: str) -> float:
        """Calculate memory efficiency score (1-10)."""
        # Simplified scoring based on known characteristics
        scores = {
            "Qdrant": 8.5,
            "ChromaDB": 7.0,
            "pgvector": 8.0,
            "Weaviate": 7.5,
            "Pinecone": 9.0  # Managed service optimized
        }
        return scores.get(db_name, 7.0)
        
    def _estimate_disk_usage(self, vector_count: int, dimension: int) -> float:
        """Estimate disk usage in MB."""
        # Rough estimate: 4 bytes per float + overhead
        vector_size_mb = (vector_count * dimension * 4) / (1024 * 1024)
        return vector_size_mb * 1.3  # 30% overhead for indexes and metadata
        
    def _estimate_monthly_cost(self, db_name: str, vector_count: int) -> float:
        """Estimate monthly cost in USD."""
        # Simplified cost estimates for different scales
        if vector_count < 100000:
            scale = "small"
        elif vector_count < 1000000:
            scale = "medium"
        else:
            scale = "large"
            
        cost_matrix = {
            "Qdrant": {"small": 0, "medium": 200, "large": 800},  # Self-hosted
            "ChromaDB": {"small": 0, "medium": 0, "large": 400},   # Self-hosted
            "pgvector": {"small": 50, "medium": 200, "large": 800}, # PostgreSQL hosting
            "Weaviate": {"small": 100, "medium": 400, "large": 1200}, # Cloud pricing
            "Pinecone": {"small": 70, "medium": 280, "large": 1120}   # Pinecone pricing
        }
        
        return cost_matrix.get(db_name, {}).get(scale, 0)
        
    def _rate_ease_of_use(self, db_name: str) -> int:
        """Rate ease of use (1-10)."""
        scores = {
            "Qdrant": 8,
            "ChromaDB": 9,
            "pgvector": 6,
            "Weaviate": 7,
            "Pinecone": 9
        }
        return scores.get(db_name, 7)
        
    def _rate_documentation(self, db_name: str) -> int:
        """Rate documentation quality (1-10)."""
        scores = {
            "Qdrant": 9,
            "ChromaDB": 8,
            "pgvector": 7,
            "Weaviate": 9,
            "Pinecone": 10
        }
        return scores.get(db_name, 7)
        
    def _rate_community(self, db_name: str) -> int:
        """Rate community support (1-10)."""
        scores = {
            "Qdrant": 7,
            "ChromaDB": 8,
            "pgvector": 9,
            "Weaviate": 8,
            "Pinecone": 8
        }
        return scores.get(db_name, 7)
        
    def generate_comparison_report(self, results: Dict[str, ComparisonMetrics]) -> str:
        """Generate comprehensive comparison report."""
        report = []
        
        # Performance comparison table
        table = Table(title="🏆 Vector Database Performance Comparison")
        table.add_column("Database", style="cyan", no_wrap=True)
        table.add_column("Insert\n(vectors/sec)", style="green")
        table.add_column("Query\n(queries/sec)", style="blue")
        table.add_column("P95 Latency\n(ms)", style="yellow")
        table.add_column("Memory\nScore", style="magenta")
        table.add_column("Monthly\nCost ($)", style="red")
        table.add_column("Overall\nScore", style="bold green")
        
        for db_name, metrics in results.items():
            overall_score = self._calculate_overall_score(metrics)
            p95_latency = metrics.query_performance.metadata.get("p95_latency", 0) * 1000  # Convert to ms
            
            table.add_row(
                db_name,
                f"{metrics.insert_performance.throughput:.1f}",
                f"{metrics.query_performance.throughput:.1f}",
                f"{p95_latency:.1f}",
                f"{metrics.memory_efficiency:.1f}",
                f"{metrics.cost_estimate:.0f}",
                f"{overall_score:.1f}/10"
            )
        
        console.print(table)
        
        # Detailed analysis
        console.print("\n[bold blue]📊 Detailed Analysis[/bold blue]")
        
        for db_name, metrics in results.items():
            panel_content = f"""
**Performance:**
• Insert: {metrics.insert_performance.throughput:.1f} vectors/sec
• Query: {metrics.query_performance.throughput:.1f} queries/sec  
• Setup Time: {metrics.setup_time:.2f} seconds

**Efficiency:**
• Memory Score: {metrics.memory_efficiency:.1f}/10
• Estimated Disk Usage: {metrics.disk_usage:.1f} MB
• Monthly Cost Estimate: ${metrics.cost_estimate:.0f}

**Usability:**
• Ease of Use: {metrics.ease_of_use_score}/10
• Documentation: {metrics.documentation_score}/10
• Community Support: {metrics.community_score}/10
            """
            
            console.print(Panel.fit(panel_content.strip(), title=f"🔍 {db_name} Details"))
            
        return "Report generated successfully"
        
    def _calculate_overall_score(self, metrics: ComparisonMetrics) -> float:
        """Calculate overall score (1-10) based on all metrics."""
        # Weighted scoring
        performance_score = min(10, (metrics.insert_performance.throughput / 1000) * 3 + (metrics.query_performance.throughput / 10) * 3)
        cost_score = max(0, 10 - (metrics.cost_estimate / 100))
        usability_score = (metrics.ease_of_use_score + metrics.documentation_score + metrics.community_score) / 3
        
        overall = (performance_score * 0.4 + cost_score * 0.3 + usability_score * 0.2 + metrics.memory_efficiency * 0.1)
        return min(10, overall)
        
    def export_results(self, results: Dict[str, ComparisonMetrics], output_file: str):
        """Export results to JSON file."""
        export_data = {}
        for db_name, metrics in results.items():
            export_data[db_name] = {
                "setup_time": metrics.setup_time,
                "insert_throughput": metrics.insert_performance.throughput,
                "query_throughput": metrics.query_performance.throughput,
                "memory_efficiency": metrics.memory_efficiency,
                "cost_estimate": metrics.cost_estimate,
                "ease_of_use": metrics.ease_of_use_score,
                "documentation": metrics.documentation_score,
                "community": metrics.community_score,
                "overall_score": self._calculate_overall_score(metrics)
            }
            
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2)
            
        console.print(f"[green]✅ Results exported to {output_file}[/green]")

# CLI Interface
@click.command()
@click.option('--databases', '-d', multiple=True, default=['qdrant', 'chroma'], 
              help='Databases to compare (qdrant, chroma, pgvector, weaviate, pinecone)')
@click.option('--vector-count', '-n', default=10000, help='Number of test vectors')
@click.option('--vector-dimension', '-dim', default=384, help='Vector dimensions')
@click.option('--query-count', '-q', default=100, help='Number of test queries')
@click.option('--output', '-o', help='Output file for results')
@click.option('--config-file', '-c', type=click.Path(exists=True), help='Configuration file')
def main(databases, vector_count, vector_dimension, query_count, output, config_file):
    """Vector Database Comparison Tool - Benchmark and compare vector databases."""
    
    # Load configuration
    config = {
        "vector_count": vector_count,
        "vector_dimension": vector_dimension,
        "query_count": query_count
    }
    
    if config_file:
        with open(config_file, 'r') as f:
            config.update(json.load(f))
    
    # Initialize comparator
    comparator = VectorDatabaseComparator(config)
    
    # Register available databases
    available_dbs = {
        'qdrant': (QdrantDatabase, QDRANT_AVAILABLE),
        'chroma': (ChromaDatabase, CHROMA_AVAILABLE),
        'pgvector': (PgVectorDatabase, PGVECTOR_AVAILABLE),
    }
    
    registered_count = 0
    for db_name in databases:
        if db_name in available_dbs:
            db_class, available = available_dbs[db_name]
            if available:
                db_config = config.get(db_name, {})
                db_config.update({
                    "vector_size": vector_dimension,
                    "collection_name": f"benchmark_{int(time.time())}"
                })
                comparator.register_database(db_class(db_config))
                registered_count += 1
                console.print(f"[green]✅ Registered {db_name}[/green]")
            else:
                console.print(f"[red]❌ {db_name} not available (missing dependencies)[/red]")
        else:
            console.print(f"[red]❌ Unknown database: {db_name}[/red]")
    
    if registered_count == 0:
        console.print("[red]❌ No databases available for comparison[/red]")
        return
    
    console.print(f"\n[bold]🎯 Benchmarking {registered_count} databases with {vector_count:,} vectors[/bold]")
    
    # Run benchmark
    async def run_benchmark():
        results = await comparator.run_comprehensive_benchmark()
        
        if results:
            # Generate report
            comparator.generate_comparison_report(results)
            
            # Export results if requested
            if output:
                comparator.export_results(results, output)
                
            # Recommendations
            console.print("\n[bold blue]🎯 Recommendations[/bold blue]")
            
            best_performance = max(results.items(), key=lambda x: x[1].query_performance.throughput)
            best_cost = min(results.items(), key=lambda x: x[1].cost_estimate)
            best_overall = max(results.items(), key=lambda x: comparator._calculate_overall_score(x[1]))
            
            console.print(f"🏃 **Best Performance**: {best_performance[0]} ({best_performance[1].query_performance.throughput:.1f} queries/sec)")
            console.print(f"💰 **Most Cost-Effective**: {best_cost[0]} (${best_cost[1].cost_estimate:.0f}/month)")
            console.print(f"🏆 **Best Overall**: {best_overall[0]} ({comparator._calculate_overall_score(best_overall[1]):.1f}/10)")
        else:
            console.print("[red]❌ No results to display[/red]")
    
    # Run the benchmark
    asyncio.run(run_benchmark())

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()