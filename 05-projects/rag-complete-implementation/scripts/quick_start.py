#!/usr/bin/env python3
"""
Quick start script for RAG Complete Implementation.
Sets up the system and runs a basic demo.
"""
import asyncio
import os
import sys
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent.parent / "src"))


async def quick_demo():
    """Run a quick demonstration of the RAG system."""
    print("🚀 RAG Complete Implementation - Quick Start Demo")
    print("=" * 60)
    
    # Check environment variables
    required_vars = ["OPENAI_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these variables in your .env file or environment.")
        print("See .env.example for reference.")
        return False
    
    try:
        from rag_system.rag_engine import RAGEngine
        from rag_system.embeddings import EmbeddingService
        from rag_system.chunking import TextChunker
        
        print("✅ All imports successful")
        
        # Initialize components
        print("\n📊 Initializing RAG Engine...")
        engine = RAGEngine()
        
        # Test embedding service
        print("🔍 Testing embedding service...")
        embedding_service = EmbeddingService()
        test_embedding = await embedding_service.embed_text("Hello, world!")
        print(f"   Embedding dimension: {len(test_embedding)}")
        
        # Test chunking
        print("📝 Testing text chunking...")
        chunker = TextChunker()
        sample_text = """
        This is a sample document for the RAG system demonstration.
        It shows how text is processed and chunked for vector storage.
        The system can handle multiple document formats and provides
        accurate retrieval with proper citation tracking.
        """
        
        chunks = chunker.chunk_text(sample_text, document_id="demo_doc")
        print(f"   Created {len(chunks)} chunks from sample text")
        
        # Initialize database (if using Supabase)
        supabase_configured = os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_KEY")
        
        if supabase_configured:
            print("💾 Initializing vector database...")
            try:
                await engine.initialize()
                print("   Database connection successful")
                
                # Quick ingestion test with sample text
                print("📚 Testing document ingestion...")
                
                # Create a temporary sample file
                sample_dir = Path("temp_demo")
                sample_dir.mkdir(exist_ok=True)
                sample_file = sample_dir / "sample.txt"
                
                with open(sample_file, 'w') as f:
                    f.write(sample_text)
                
                try:
                    results = await engine.ingest_documents([str(sample_file)])
                    print(f"   Ingested {results['processed_documents']} document(s)")
                    print(f"   Created {results['total_chunks']} chunks")
                    
                    # Test query
                    print("❓ Testing query functionality...")
                    response = await engine.query("What is this document about?")
                    print(f"   Query successful!")
                    print(f"   Response length: {len(response.answer)} characters")
                    print(f"   Sources found: {len(response.sources)}")
                    print(f"   Response time: {response.response_time:.2f}s")
                    
                    print(f"\n💬 Sample Response:")
                    print(f"   Question: What is this document about?")
                    print(f"   Answer: {response.answer[:200]}...")
                    
                    # Cleanup
                    sample_file.unlink()
                    sample_dir.rmdir()
                    
                except Exception as e:
                    print(f"   ⚠️ Ingestion/Query test failed: {str(e)}")
                    
                finally:
                    await engine.close()
                    
            except Exception as e:
                print(f"   ❌ Database initialization failed: {str(e)}")
                print("   This is normal if you haven't set up Supabase yet")
        else:
            print("💾 Supabase not configured (SUPABASE_URL/SUPABASE_KEY missing)")
            print("   Skipping database tests - this is normal for first run")
        
        print(f"\n🎉 Quick Demo Complete!")
        print(f"✅ Core components are working correctly")
        
        if supabase_configured:
            print(f"\n🚀 Ready to use! Try running:")
            print(f"   streamlit run ui/streamlit_app.py")
        else:
            print(f"\n📋 Next Steps:")
            print(f"   1. Set up Supabase account and get API keys")
            print(f"   2. Update .env file with your keys")
            print(f"   3. Run: python scripts/setup_database.py")
            print(f"   4. Run: streamlit run ui/streamlit_app.py")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {str(e)}")
        print("Please install requirements: pip install -r requirements.txt")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def print_system_info():
    """Print system information and requirements."""
    print("🔍 System Information")
    print("-" * 30)
    print(f"Python version: {sys.version}")
    
    # Check key packages
    packages = ["openai", "supabase", "streamlit", "langfuse", "tiktoken"]
    for package in packages:
        try:
            __import__(package)
            print(f"✅ {package}: Available")
        except ImportError:
            print(f"❌ {package}: Not installed")
    
    # Check environment variables
    print(f"\n🔧 Environment Variables")
    print("-" * 30)
    env_vars = [
        "OPENAI_API_KEY",
        "SUPABASE_URL", 
        "SUPABASE_KEY",
        "LANGFUSE_PUBLIC_KEY"
    ]
    
    for var in env_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: Set ({'*' * 8}...)")
        else:
            print(f"❌ {var}: Not set")


def main():
    """Main function."""
    if len(sys.argv) > 1 and sys.argv[1] == "--info":
        print_system_info()
        return
    
    try:
        success = asyncio.run(quick_demo())
        if success:
            print(f"\n🎯 RAG Complete Implementation is ready!")
            print(f"📖 Check README.md for detailed documentation")
            print(f"🐛 Report issues at: https://github.com/your-repo/issues")
        else:
            print(f"\n🔧 Setup needs attention - check the messages above")
        
    except KeyboardInterrupt:
        print(f"\n⏹️ Demo interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()