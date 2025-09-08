"""
Pytest configuration and fixtures for RAG system tests.
"""
import asyncio
import pytest
import os
import tempfile
import shutil
from pathlib import Path
import sys

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from rag_system.rag_engine import RAGEngine
from rag_system.embeddings import EmbeddingService
from rag_system.vector_store import SupabaseVectorStore
from rag_system.document_processor import DocumentProcessor
from rag_system.chunking import TextChunker


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def sample_text():
    """Sample text for testing."""
    return """
    Artificial intelligence (AI) is intelligence demonstrated by machines, 
    in contrast to the natural intelligence displayed by humans and animals. 
    Leading AI textbooks define the field as the study of "intelligent agents": 
    any device that perceives its environment and takes actions that maximize 
    its chance of successfully achieving its goals.
    
    Machine learning (ML) is a subset of artificial intelligence (AI) that 
    focuses on the use of data and algorithms to imitate the way that humans 
    learn, gradually improving its accuracy. Machine learning is an important 
    component of the growing field of data science.
    
    Natural Language Processing (NLP) is a subfield of linguistics, computer 
    science, and artificial intelligence concerned with the interactions between 
    computers and human language, in particular how to program computers to 
    process and analyze large amounts of natural language data.
    """


@pytest.fixture
def sample_documents():
    """Sample documents for testing."""
    return [
        {
            "id": "doc1",
            "content": "The quick brown fox jumps over the lazy dog. This is a test document.",
            "metadata": {"type": "test", "category": "animals"}
        },
        {
            "id": "doc2", 
            "content": "Python is a high-level programming language. It is widely used in data science.",
            "metadata": {"type": "test", "category": "programming"}
        },
        {
            "id": "doc3",
            "content": "Machine learning algorithms can be supervised, unsupervised, or semi-supervised.",
            "metadata": {"type": "test", "category": "ml"}
        }
    ]


@pytest.fixture
def temp_directory():
    """Create a temporary directory for testing."""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)


@pytest.fixture
def sample_files(temp_directory):
    """Create sample files for testing document processing."""
    files = {}
    
    # Create sample text file
    txt_file = Path(temp_directory) / "sample.txt"
    txt_file.write_text("This is a sample text file for testing document processing.")
    files['txt'] = str(txt_file)
    
    # Create sample markdown file
    md_file = Path(temp_directory) / "sample.md"
    md_file.write_text("""# Sample Markdown
    
This is a **sample** markdown file for testing.

## Features
- List item 1
- List item 2

Some code: `print("hello world")`
    """)
    files['md'] = str(md_file)
    
    # Create sample HTML file
    html_file = Path(temp_directory) / "sample.html"
    html_file.write_text("""<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML</title>
</head>
<body>
    <h1>Sample HTML Document</h1>
    <p>This is a <strong>sample</strong> HTML file for testing.</p>
    <div>Some content in a div.</div>
</body>
</html>
    """)
    files['html'] = str(html_file)
    
    return files


@pytest.fixture
def mock_embeddings():
    """Mock embeddings for testing."""
    return [
        [0.1, 0.2, 0.3, 0.4, 0.5] * 307 + [0.1, 0.2, 0.3],  # 1536 dimensions
        [0.5, 0.4, 0.3, 0.2, 0.1] * 307 + [0.5, 0.4, 0.3],  # 1536 dimensions
        [0.3, 0.3, 0.3, 0.3, 0.3] * 307 + [0.3, 0.3, 0.3],  # 1536 dimensions
    ]


@pytest.fixture
async def chunker():
    """Text chunker instance for testing."""
    return TextChunker(chunk_size=100, chunk_overlap=20)


@pytest.fixture
async def document_processor():
    """Document processor instance for testing."""
    return DocumentProcessor()


@pytest.fixture
async def mock_embedding_service():
    """Mock embedding service for testing."""
    class MockEmbeddingService:
        async def embed_text(self, text):
            # Return a mock embedding
            return [0.1, 0.2, 0.3, 0.4, 0.5] * 307 + [0.1, 0.2, 0.3]
        
        async def embed_texts(self, texts):
            # Return mock embeddings for multiple texts
            return [[0.1, 0.2, 0.3, 0.4, 0.5] * 307 + [0.1, 0.2, 0.3] for _ in texts]
        
        async def batch_embed(self, texts, batch_size=100):
            return await self.embed_texts(texts)
        
        def count_tokens(self, text):
            return len(text.split())
    
    return MockEmbeddingService()


@pytest.fixture
async def mock_vector_store():
    """Mock vector store for testing."""
    class MockVectorStore:
        def __init__(self):
            self.chunks = []
            self.embeddings = []
        
        async def initialize_database(self):
            pass
        
        async def add_chunks(self, chunks, embeddings):
            self.chunks.extend(chunks)
            self.embeddings.extend(embeddings)
            return [f"id_{i}" for i in range(len(chunks))]
        
        async def similarity_search(self, query_embedding, top_k=5, **kwargs):
            # Return mock similar chunks
            return [
                {
                    "id": "mock_id_1",
                    "chunk_id": "mock_chunk_1",
                    "document_id": "mock_doc_1",
                    "content": "Mock content 1",
                    "similarity": 0.9,
                    "metadata": {"test": True}
                },
                {
                    "id": "mock_id_2", 
                    "chunk_id": "mock_chunk_2",
                    "document_id": "mock_doc_2",
                    "content": "Mock content 2",
                    "similarity": 0.8,
                    "metadata": {"test": True}
                }
            ]
        
        async def get_collection_stats(self):
            return {
                "total_chunks": len(self.chunks),
                "total_documents": len(set(chunk.metadata.get("document_id", "") for chunk in self.chunks)),
                "total_tokens": sum(chunk.token_count or 0 for chunk in self.chunks),
                "avg_tokens_per_chunk": 100
            }
        
        async def close(self):
            pass
    
    return MockVectorStore()


@pytest.fixture
async def mock_openai_client():
    """Mock OpenAI client for testing."""
    class MockChoice:
        def __init__(self, content):
            self.message = type('Message', (), {'content': content})()
    
    class MockUsage:
        def __init__(self):
            self.prompt_tokens = 50
            self.completion_tokens = 25
            self.total_tokens = 75
    
    class MockResponse:
        def __init__(self, content):
            self.choices = [MockChoice(content)]
            self.usage = MockUsage()
    
    class MockOpenAIClient:
        async def chat_completions_create(self, **kwargs):
            return MockResponse("Mock response based on the provided context.")
        
        class chat:
            class completions:
                @staticmethod
                async def create(**kwargs):
                    return MockResponse("Mock response based on the provided context.")
    
    return MockOpenAIClient()


@pytest.fixture
def test_config():
    """Test configuration settings."""
    return {
        "chunk_size": 100,
        "chunk_overlap": 20,
        "top_k": 3,
        "similarity_threshold": 0.7,
        "max_tokens": 100,
        "temperature": 0.1
    }