#!/usr/bin/env python3
"""
Document ingestion script for RAG system.
Processes documents from a directory and adds them to the vector store.
"""
import asyncio
import argparse
import sys
import os
import json
from pathlib import Path
from datetime import datetime
from typing import Optional

# Add src to path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from rag_system.rag_engine import RAGEngine
from rag_system.observability import RAGObservability


async def ingest_directory(
    directory_path: str,
    recursive: bool = True,
    max_files: Optional[int] = None,
    batch_size: int = 50,
    output_file: Optional[str] = None
):
    """
    Ingest documents from a directory.
    
    Args:
        directory_path: Path to directory containing documents
        recursive: Whether to process subdirectories
        max_files: Maximum number of files to process
        batch_size: Batch size for embedding generation
        output_file: Optional file to save ingestion results
    """
    print(f"Starting document ingestion from: {directory_path}")
    print(f"Recursive: {recursive}")
    print(f"Max files: {max_files or 'unlimited'}")
    print(f"Batch size: {batch_size}")
    print("-" * 50)
    
    try:
        # Initialize RAG engine
        print("Initializing RAG engine...")
        engine = RAGEngine()
        await engine.initialize()
        
        # Initialize observability
        observability = RAGObservability()
        
        # Start ingestion
        start_time = datetime.now()
        results = await engine.ingest_directory(
            directory_path=directory_path,
            recursive=recursive,
            max_files=max_files,
            batch_size=batch_size
        )
        end_time = datetime.now()
        
        # Process results
        processing_time = (end_time - start_time).total_seconds()
        
        print("\n" + "=" * 50)
        print("INGESTION RESULTS")
        print("=" * 50)
        print(f"Processed Documents: {results.get('processed_documents', 0)}")
        print(f"Total Chunks: {results.get('total_chunks', 0)}")
        print(f"Processing Time: {processing_time:.2f} seconds")
        
        if 'document_stats' in results:
            stats = results['document_stats']
            print(f"Total Content Length: {stats.get('total_content_length', 0):,} characters")
            print(f"Total Word Count: {stats.get('total_word_count', 0):,} words")
            print(f"Average Content Length: {stats.get('avg_content_length', 0):.1f} characters/doc")
            
            if 'file_types' in stats:
                print(f"\nFile Types Processed:")
                for file_type, count in stats['file_types'].items():
                    print(f"  {file_type}: {count} files")
        
        # Get collection statistics
        print("\nUpdated Collection Statistics:")
        collection_stats = await engine.get_collection_stats()
        print(f"Total Documents: {collection_stats.get('total_documents', 0)}")
        print(f"Total Chunks: {collection_stats.get('total_chunks', 0)}")
        print(f"Total Tokens: {collection_stats.get('total_tokens', 0):,}")
        print(f"Average Tokens per Chunk: {collection_stats.get('avg_tokens_per_chunk', 0):.1f}")
        
        # Log to observability
        if observability.manager.enabled:
            await observability.trace_ingestion(
                file_paths=[directory_path],
                document_count=results.get('processed_documents', 0),
                chunk_count=results.get('total_chunks', 0),
                processing_time=processing_time
            )
        
        # Save results to file if specified
        if output_file:
            output_data = {
                "ingestion_timestamp": start_time.isoformat(),
                "directory_path": directory_path,
                "processing_time_seconds": processing_time,
                "results": results,
                "collection_stats": collection_stats
            }
            
            with open(output_file, 'w') as f:
                json.dump(output_data, f, indent=2, default=str)
            print(f"\nResults saved to: {output_file}")
        
        await engine.close()
        print("\nIngestion completed successfully!")
        return True
        
    except Exception as e:
        print(f"\nError during ingestion: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


async def ingest_files(
    file_paths: list,
    document_ids: Optional[list] = None,
    batch_size: int = 50,
    output_file: Optional[str] = None
):
    """
    Ingest specific files.
    
    Args:
        file_paths: List of file paths to ingest
        document_ids: Optional custom document IDs
        batch_size: Batch size for embedding generation
        output_file: Optional file to save ingestion results
    """
    print(f"Starting ingestion of {len(file_paths)} files")
    print(f"Files to process:")
    for i, file_path in enumerate(file_paths):
        print(f"  {i+1}. {file_path}")
    print(f"Batch size: {batch_size}")
    print("-" * 50)
    
    try:
        # Initialize RAG engine
        print("Initializing RAG engine...")
        engine = RAGEngine()
        await engine.initialize()
        
        # Start ingestion
        start_time = datetime.now()
        results = await engine.ingest_documents(
            file_paths=file_paths,
            document_ids=document_ids,
            batch_size=batch_size
        )
        end_time = datetime.now()
        
        # Process results
        processing_time = (end_time - start_time).total_seconds()
        
        print("\n" + "=" * 50)
        print("INGESTION RESULTS")
        print("=" * 50)
        print(f"Processed Documents: {results['processed_documents']}")
        print(f"Total Chunks: {results['total_chunks']}")
        print(f"Processing Time: {processing_time:.2f} seconds")
        print(f"Failed Documents: {len(results['failed_documents'])}")
        
        if results['failed_documents']:
            print("\nFailed Documents:")
            for failed in results['failed_documents']:
                print(f"  - {failed['file_path']}: {failed['error']}")
        
        if 'document_stats' in results:
            stats = results['document_stats']
            print(f"\nDocument Statistics:")
            print(f"Total Content Length: {stats.get('total_content_length', 0):,} characters")
            print(f"Total Word Count: {stats.get('total_word_count', 0):,} words")
            print(f"Average Content Length: {stats.get('avg_content_length', 0):.1f} characters/doc")
        
        # Save results to file if specified
        if output_file:
            output_data = {
                "ingestion_timestamp": start_time.isoformat(),
                "file_paths": file_paths,
                "document_ids": document_ids,
                "processing_time_seconds": processing_time,
                "results": results
            }
            
            with open(output_file, 'w') as f:
                json.dump(output_data, f, indent=2, default=str)
            print(f"\nResults saved to: {output_file}")
        
        await engine.close()
        print("\nIngestion completed successfully!")
        return True
        
    except Exception as e:
        print(f"\nError during ingestion: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main function with argument parsing."""
    parser = argparse.ArgumentParser(description="Ingest documents into RAG system")
    
    # Main operation
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--directory", "-d",
        type=str,
        help="Directory path to ingest documents from"
    )
    group.add_argument(
        "--files", "-f",
        nargs="+",
        help="Specific files to ingest"
    )
    
    # Options
    parser.add_argument(
        "--recursive", "-r",
        action="store_true",
        help="Process subdirectories recursively (for directory mode)"
    )
    parser.add_argument(
        "--max-files", "-m",
        type=int,
        help="Maximum number of files to process"
    )
    parser.add_argument(
        "--batch-size", "-b",
        type=int,
        default=50,
        help="Batch size for embedding generation (default: 50)"
    )
    parser.add_argument(
        "--document-ids",
        nargs="+",
        help="Custom document IDs (for file mode, must match number of files)"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Output file to save ingestion results (JSON format)"
    )
    parser.add_argument(
        "--check-env",
        action="store_true",
        help="Check environment variables and exit"
    )
    
    args = parser.parse_args()
    
    # Check environment variables
    if args.check_env:
        required_vars = [
            "OPENAI_API_KEY",
            "SUPABASE_URL", 
            "SUPABASE_KEY",
            "DB_PASSWORD"
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
            print("Please set them before running the ingestion.")
        
        return
    
    # Validate arguments
    if args.files and args.document_ids:
        if len(args.files) != len(args.document_ids):
            print("Error: Number of files must match number of document IDs")
            sys.exit(1)
    
    if args.directory and not os.path.exists(args.directory):
        print(f"Error: Directory does not exist: {args.directory}")
        sys.exit(1)
    
    if args.files:
        for file_path in args.files:
            if not os.path.exists(file_path):
                print(f"Error: File does not exist: {file_path}")
                sys.exit(1)
    
    # Run ingestion
    try:
        if args.directory:
            success = asyncio.run(ingest_directory(
                directory_path=args.directory,
                recursive=args.recursive,
                max_files=args.max_files,
                batch_size=args.batch_size,
                output_file=args.output
            ))
        else:
            success = asyncio.run(ingest_files(
                file_paths=args.files,
                document_ids=args.document_ids,
                batch_size=args.batch_size,
                output_file=args.output
            ))
        
        sys.exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\nIngestion interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()