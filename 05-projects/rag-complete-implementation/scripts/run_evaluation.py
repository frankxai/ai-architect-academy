#!/usr/bin/env python3
"""
Evaluation script for RAG system performance.
Runs comprehensive evaluation tests and generates performance reports.
"""
import asyncio
import argparse
import json
import sys
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

# Add src to path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from rag_system.rag_engine import RAGEngine
from tests.test_evaluation import RAGEvaluator, EvaluationResult


# Default test cases for evaluation
DEFAULT_TEST_CASES = [
    {
        "query": "What is artificial intelligence?",
        "expected_answer": "Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to natural intelligence displayed by humans and animals. It involves creating machines capable of performing tasks that typically require human intelligence.",
        "relevant_documents": []
    },
    {
        "query": "How does machine learning work?",
        "expected_answer": "Machine learning works by using algorithms and statistical models that enable computers to improve their performance on a specific task through experience, without being explicitly programmed for every scenario.",
        "relevant_documents": []
    },
    {
        "query": "What are the types of machine learning?",
        "expected_answer": "The main types of machine learning are supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards).",
        "relevant_documents": []
    },
    {
        "query": "What is RAG in AI?",
        "expected_answer": "RAG (Retrieval-Augmented Generation) is a technique that combines information retrieval systems with generative language models to provide more accurate and contextually relevant responses by accessing external knowledge sources.",
        "relevant_documents": []
    },
    {
        "query": "What are the benefits of RAG systems?",
        "expected_answer": "RAG systems provide benefits including up-to-date information beyond training data, domain-specific knowledge incorporation, reduced hallucination through external grounding, transparency with source attribution, and cost efficiency without retraining.",
        "relevant_documents": []
    },
    {
        "query": "How do you evaluate machine learning models?",
        "expected_answer": "Machine learning models are evaluated using various metrics depending on the task type. For classification: accuracy, precision, recall, F1-score. For regression: MAE, MSE, RMSE, R-squared. Cross-validation and holdout testing are used to assess generalization.",
        "relevant_documents": []
    },
    {
        "query": "What is deep learning?",
        "expected_answer": "Deep learning is a subset of machine learning that uses neural networks with multiple layers to model and understand complex patterns in data. It has been particularly successful in image recognition, natural language processing, and speech recognition.",
        "relevant_documents": []
    },
    {
        "query": "What are the challenges in implementing RAG systems?",
        "expected_answer": "Key challenges in RAG systems include retrieval quality, context length limitations, latency requirements, preventing hallucination, ensuring proper source attribution, and handling conflicting information from multiple sources.",
        "relevant_documents": []
    },
    {
        "query": "How do you chunk documents for RAG?",
        "expected_answer": "Document chunking for RAG involves strategies like fixed-size chunking, semantic chunking to preserve meaning, overlapping chunks for context continuity, and hierarchical chunking with multiple granularity levels.",
        "relevant_documents": []
    },
    {
        "query": "What is the difference between AI, ML, and DL?",
        "expected_answer": "AI (Artificial Intelligence) is the broadest concept of machines being smart. ML (Machine Learning) is a subset of AI where machines learn from data. DL (Deep Learning) is a subset of ML using neural networks with many layers.",
        "relevant_documents": []
    }
]


async def run_evaluation(
    test_cases: List[Dict[str, Any]],
    output_file: str = None,
    verbose: bool = False
) -> Dict[str, Any]:
    """
    Run comprehensive evaluation of the RAG system.
    
    Args:
        test_cases: List of test cases to evaluate
        output_file: File to save detailed results
        verbose: Whether to print verbose output
        
    Returns:
        Dictionary with evaluation results and metrics
    """
    print("=" * 60)
    print("RAG SYSTEM EVALUATION")
    print("=" * 60)
    print(f"Test Cases: {len(test_cases)}")
    print(f"Output File: {output_file or 'None'}")
    print(f"Verbose Mode: {verbose}")
    print()
    
    try:
        # Initialize RAG engine
        print("Initializing RAG engine...")
        engine = RAGEngine()
        await engine.initialize()
        
        # Get collection stats
        collection_stats = await engine.get_collection_stats()
        print(f"Collection Stats: {collection_stats.get('total_documents', 0)} documents, "
              f"{collection_stats.get('total_chunks', 0)} chunks")
        print()
        
        # Initialize evaluator
        evaluator = RAGEvaluator(engine)
        
        # Run evaluation
        print("Running evaluation...")
        start_time = datetime.now()
        
        evaluation_results = []
        for i, test_case in enumerate(test_cases, 1):
            if verbose:
                print(f"\nEvaluating {i}/{len(test_cases)}: {test_case['query'][:60]}...")
            else:
                print(f"Progress: {i}/{len(test_cases)}", end='\r')
            
            try:
                result = await evaluator.evaluate_query(
                    query=test_case["query"],
                    expected_answer=test_case.get("expected_answer", ""),
                    relevant_documents=test_case.get("relevant_documents", [])
                )
                evaluation_results.append(result)
                
                if verbose:
                    print(f"  Relevance: {result.relevance_score:.3f}")
                    print(f"  Accuracy: {result.accuracy_score:.3f}")
                    print(f"  Citations: {result.citation_score:.3f}")
                    print(f"  Time: {result.response_time:.3f}s")
                    print(f"  Tokens: {result.token_usage.get('total_tokens', 0)}")
                    
            except Exception as e:
                print(f"\nError evaluating query {i}: {str(e)}")
                continue
        
        end_time = datetime.now()
        total_time = (end_time - start_time).total_seconds()
        
        if not verbose:
            print()  # Clear the progress line
        
        print(f"\nEvaluation completed in {total_time:.2f} seconds")
        print(f"Successfully evaluated: {len(evaluation_results)}/{len(test_cases)} queries")
        
        # Calculate aggregate metrics
        print("\n" + "=" * 60)
        print("EVALUATION RESULTS")
        print("=" * 60)
        
        if evaluation_results:
            metrics = evaluator.calculate_aggregate_metrics(evaluation_results)
            
            print(f"Average Relevance Score: {metrics['avg_relevance_score']:.3f}")
            print(f"Average Accuracy Score:  {metrics['avg_accuracy_score']:.3f}")
            print(f"Average Citation Score:  {metrics['avg_citation_score']:.3f}")
            print(f"Average Response Time:   {metrics['avg_response_time']:.3f}s")
            print(f"Median Response Time:    {metrics['median_response_time']:.3f}s")
            print(f"P95 Response Time:       {metrics['p95_response_time']:.3f}s")
            print(f"Average Tokens/Query:    {metrics['avg_tokens_per_query']:.1f}")
            print(f"Success Rate:            {metrics['success_rate']:.1%}")
            print(f"Total Queries:           {metrics['total_queries']}")
            
            # Calculate cost estimate (rough)
            total_tokens = sum(r.token_usage.get('total_tokens', 0) for r in evaluation_results)
            estimated_cost = total_tokens * 0.000015  # Rough estimate for GPT-4o-mini
            print(f"Estimated Cost:          ${estimated_cost:.4f}")
            
            # Detailed breakdown if verbose
            if verbose:
                print("\n" + "-" * 60)
                print("DETAILED RESULTS")
                print("-" * 60)
                
                for i, result in enumerate(evaluation_results, 1):
                    print(f"\nQuery {i}: {result.query[:80]}...")
                    print(f"  Answer: {result.actual_answer[:100]}...")
                    print(f"  Sources: {len(result.sources)}")
                    print(f"  Relevance: {result.relevance_score:.3f}")
                    print(f"  Accuracy: {result.accuracy_score:.3f}")
                    print(f"  Citations: {result.citation_score:.3f}")
                    print(f"  Time: {result.response_time:.3f}s")
                    print(f"  Tokens: {result.token_usage.get('total_tokens', 0)}")
            
        else:
            print("No successful evaluations to analyze.")
            metrics = {}
        
        # Prepare results for output
        results_data = {
            "evaluation_timestamp": start_time.isoformat(),
            "total_evaluation_time": total_time,
            "test_cases_count": len(test_cases),
            "successful_evaluations": len(evaluation_results),
            "collection_stats": collection_stats,
            "aggregate_metrics": metrics,
            "individual_results": [
                {
                    "query": r.query,
                    "expected_answer": r.expected_answer,
                    "actual_answer": r.actual_answer,
                    "sources_count": len(r.sources),
                    "response_time": r.response_time,
                    "relevance_score": r.relevance_score,
                    "accuracy_score": r.accuracy_score,
                    "citation_score": r.citation_score,
                    "token_usage": r.token_usage,
                    "sources": r.sources
                }
                for r in evaluation_results
            ]
        }
        
        # Save results to file
        if output_file:
            with open(output_file, 'w') as f:
                json.dump(results_data, f, indent=2, default=str)
            print(f"\nDetailed results saved to: {output_file}")
        
        await engine.close()
        
        print("\n" + "=" * 60)
        print("EVALUATION COMPLETE")
        print("=" * 60)
        
        return results_data
        
    except Exception as e:
        print(f"\nError during evaluation: {str(e)}")
        import traceback
        traceback.print_exc()
        return {}


async def run_performance_benchmark(
    num_queries: int = 50,
    concurrent_requests: int = 1,
    output_file: str = None
):
    """
    Run performance benchmark tests.
    
    Args:
        num_queries: Number of queries to run
        concurrent_requests: Number of concurrent requests
        output_file: File to save results
    """
    print("=" * 60)
    print("RAG SYSTEM PERFORMANCE BENCHMARK")
    print("=" * 60)
    print(f"Number of Queries: {num_queries}")
    print(f"Concurrent Requests: {concurrent_requests}")
    print()
    
    try:
        # Initialize RAG engine
        engine = RAGEngine()
        await engine.initialize()
        
        # Sample queries for benchmarking
        benchmark_queries = [
            "What is artificial intelligence?",
            "How does machine learning work?",
            "What are neural networks?",
            "Explain deep learning",
            "What is natural language processing?",
            "How do you train a model?",
            "What is overfitting?",
            "What are the types of AI?",
            "How does RAG work?",
            "What is supervised learning?"
        ]
        
        # Create query list by repeating benchmark queries
        queries = (benchmark_queries * (num_queries // len(benchmark_queries) + 1))[:num_queries]
        
        print("Starting performance benchmark...")
        start_time = datetime.now()
        
        # Run queries with concurrency control
        semaphore = asyncio.Semaphore(concurrent_requests)
        
        async def run_single_query(query, query_id):
            async with semaphore:
                query_start = datetime.now()
                try:
                    response = await engine.query(query)
                    query_end = datetime.now()
                    
                    return {
                        "query_id": query_id,
                        "query": query,
                        "success": True,
                        "response_time": (query_end - query_start).total_seconds(),
                        "token_usage": response.token_usage,
                        "sources_count": len(response.sources)
                    }
                except Exception as e:
                    query_end = datetime.now()
                    return {
                        "query_id": query_id,
                        "query": query,
                        "success": False,
                        "response_time": (query_end - query_start).total_seconds(),
                        "error": str(e),
                        "token_usage": {"total_tokens": 0},
                        "sources_count": 0
                    }
        
        # Execute all queries
        tasks = [run_single_query(query, i) for i, query in enumerate(queries)]
        results = await asyncio.gather(*tasks)
        
        end_time = datetime.now()
        total_time = (end_time - start_time).total_seconds()
        
        # Analyze results
        successful_results = [r for r in results if r["success"]]
        failed_results = [r for r in results if not r["success"]]
        
        print(f"\nBenchmark completed in {total_time:.2f} seconds")
        print(f"Successful queries: {len(successful_results)}/{num_queries}")
        print(f"Failed queries: {len(failed_results)}")
        
        if successful_results:
            response_times = [r["response_time"] for r in successful_results]
            token_counts = [r["token_usage"].get("total_tokens", 0) for r in successful_results]
            
            print(f"\nPerformance Metrics:")
            print(f"Throughput: {len(successful_results) / total_time:.2f} queries/second")
            print(f"Average Response Time: {sum(response_times) / len(response_times):.3f}s")
            print(f"Median Response Time: {sorted(response_times)[len(response_times)//2]:.3f}s")
            print(f"Min Response Time: {min(response_times):.3f}s")
            print(f"Max Response Time: {max(response_times):.3f}s")
            print(f"Average Tokens: {sum(token_counts) / len(token_counts):.1f}")
            print(f"Total Tokens: {sum(token_counts):,}")
            
            # Percentiles
            sorted_times = sorted(response_times)
            p95_idx = int(0.95 * len(sorted_times))
            p99_idx = int(0.99 * len(sorted_times))
            
            print(f"P95 Response Time: {sorted_times[p95_idx]:.3f}s")
            print(f"P99 Response Time: {sorted_times[p99_idx]:.3f}s")
        
        # Save results
        if output_file:
            benchmark_data = {
                "benchmark_timestamp": start_time.isoformat(),
                "total_time": total_time,
                "num_queries": num_queries,
                "concurrent_requests": concurrent_requests,
                "successful_queries": len(successful_results),
                "failed_queries": len(failed_results),
                "results": results
            }
            
            with open(output_file, 'w') as f:
                json.dump(benchmark_data, f, indent=2, default=str)
            print(f"\nBenchmark results saved to: {output_file}")
        
        await engine.close()
        
    except Exception as e:
        print(f"Error during benchmark: {str(e)}")
        import traceback
        traceback.print_exc()


def load_test_cases(file_path: str) -> List[Dict[str, Any]]:
    """Load test cases from a JSON file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading test cases from {file_path}: {str(e)}")
        return DEFAULT_TEST_CASES


def main():
    """Main function with argument parsing."""
    parser = argparse.ArgumentParser(description="Run RAG system evaluation")
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Evaluation command
    eval_parser = subparsers.add_parser('evaluate', help='Run evaluation tests')
    eval_parser.add_argument(
        '--test-cases', '-t',
        type=str,
        help='JSON file containing test cases'
    )
    eval_parser.add_argument(
        '--output', '-o',
        type=str,
        help='Output file for results'
    )
    eval_parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Verbose output'
    )
    
    # Benchmark command
    bench_parser = subparsers.add_parser('benchmark', help='Run performance benchmark')
    bench_parser.add_argument(
        '--queries', '-q',
        type=int,
        default=50,
        help='Number of queries to run (default: 50)'
    )
    bench_parser.add_argument(
        '--concurrent', '-c',
        type=int,
        default=1,
        help='Number of concurrent requests (default: 1)'
    )
    bench_parser.add_argument(
        '--output', '-o',
        type=str,
        help='Output file for results'
    )
    
    # Environment check
    parser.add_argument(
        '--check-env',
        action='store_true',
        help='Check environment variables and exit'
    )
    
    args = parser.parse_args()
    
    # Check environment variables
    if args.check_env:
        required_vars = [
            "OPENAI_API_KEY",
            "SUPABASE_URL",
            "SUPABASE_KEY"
        ]
        
        print("Environment Variable Check:")
        print("-" * 30)
        all_present = True
        for var in required_vars:
            value = os.getenv(var)
            if value:
                print(f"✓ {var}: {'*' * min(len(value), 8)}...")
            else:
                print(f"✗ {var}: Not set")
                all_present = False
        
        if all_present:
            print("\nAll required environment variables are set!")
        else:
            print("\nSome required environment variables are missing.")
        
        return
    
    if not args.command:
        parser.print_help()
        return
    
    try:
        if args.command == 'evaluate':
            # Load test cases
            if args.test_cases:
                test_cases = load_test_cases(args.test_cases)
            else:
                test_cases = DEFAULT_TEST_CASES
                print(f"Using {len(test_cases)} default test cases")
            
            # Run evaluation
            asyncio.run(run_evaluation(
                test_cases=test_cases,
                output_file=args.output,
                verbose=args.verbose
            ))
            
        elif args.command == 'benchmark':
            # Run benchmark
            asyncio.run(run_performance_benchmark(
                num_queries=args.queries,
                concurrent_requests=args.concurrent,
                output_file=args.output
            ))
        
    except KeyboardInterrupt:
        print("\nEvaluation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()