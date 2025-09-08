"""
Tests for the main RAG engine functionality.
"""
import pytest
from unittest.mock import patch, AsyncMock
from rag_system.rag_engine import RAGEngine, RAGResponse


class TestRAGEngine:
    """Test cases for RAGEngine class."""
    
    @pytest.mark.asyncio
    async def test_rag_engine_initialization(self, mock_vector_store, mock_embedding_service):
        """Test RAG engine initialization."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        assert engine.vector_store is not None
        assert engine.embedding_service is not None
        assert engine.document_processor is not None
    
    @pytest.mark.asyncio
    async def test_initialize_engine(self, mock_vector_store, mock_embedding_service):
        """Test RAG engine initialization process."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        # Should not raise any exceptions
        await engine.initialize()
    
    @pytest.mark.asyncio
    async def test_ingest_single_document(self, mock_vector_store, mock_embedding_service, sample_files):
        """Test ingesting a single document."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        results = await engine.ingest_documents(sample_files['txt'])
        
        assert results["processed_documents"] == 1
        assert results["total_chunks"] > 0
        assert len(results["failed_documents"]) == 0
        assert results["processing_time"] > 0
    
    @pytest.mark.asyncio
    async def test_ingest_multiple_documents(self, mock_vector_store, mock_embedding_service, sample_files):
        """Test ingesting multiple documents."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        file_paths = list(sample_files.values())
        results = await engine.ingest_documents(file_paths)
        
        assert results["processed_documents"] == len(file_paths)
        assert results["total_chunks"] > 0
        assert results["processing_time"] > 0
    
    @pytest.mark.asyncio
    async def test_ingest_nonexistent_file(self, mock_vector_store, mock_embedding_service):
        """Test ingesting a non-existent file."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        results = await engine.ingest_documents("nonexistent.txt")
        
        assert results["processed_documents"] == 0
        assert len(results["failed_documents"]) == 1
        assert "nonexistent.txt" in results["failed_documents"][0]["file_path"]
    
    @pytest.mark.asyncio
    async def test_ingest_directory(self, mock_vector_store, mock_embedding_service, temp_directory, sample_files):
        """Test ingesting documents from a directory."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        results = await engine.ingest_directory(temp_directory)
        
        assert "processed_documents" in results
        assert "total_chunks" in results
        assert results["processed_documents"] > 0
    
    @pytest.mark.asyncio
    async def test_query_with_results(self, mock_vector_store, mock_embedding_service):
        """Test querying with available results."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        # Mock the OpenAI client
        with patch.object(engine, 'openai_client') as mock_client:
            mock_response = AsyncMock()
            mock_response.choices = [AsyncMock()]
            mock_response.choices[0].message.content = "This is a mock response based on the retrieved context."
            mock_response.usage.prompt_tokens = 50
            mock_response.usage.completion_tokens = 25
            mock_response.usage.total_tokens = 75
            
            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
            
            result = await engine.query("What is artificial intelligence?")
            
            assert isinstance(result, RAGResponse)
            assert result.answer
            assert len(result.sources) > 0
            assert result.query == "What is artificial intelligence?"
            assert result.response_time > 0
            assert result.token_usage["total_tokens"] > 0
    
    @pytest.mark.asyncio
    async def test_query_no_results(self, mock_embedding_service):
        """Test querying with no available results."""
        # Create a mock vector store that returns no results
        class EmptyVectorStore:
            async def initialize_database(self):
                pass
            
            async def similarity_search(self, *args, **kwargs):
                return []
            
            async def hybrid_search(self, *args, **kwargs):
                return []
            
            async def close(self):
                pass
        
        engine = RAGEngine(
            vector_store=EmptyVectorStore(),
            embedding_service=mock_embedding_service
        )
        
        result = await engine.query("What is artificial intelligence?")
        
        assert isinstance(result, RAGResponse)
        assert "couldn't find any relevant information" in result.answer
        assert len(result.sources) == 0
    
    @pytest.mark.asyncio
    async def test_query_with_filters(self, mock_vector_store, mock_embedding_service):
        """Test querying with filters."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        with patch.object(engine, 'openai_client') as mock_client:
            mock_response = AsyncMock()
            mock_response.choices = [AsyncMock()]
            mock_response.choices[0].message.content = "Filtered response"
            mock_response.usage.prompt_tokens = 50
            mock_response.usage.completion_tokens = 25
            mock_response.usage.total_tokens = 75
            
            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
            
            result = await engine.query(
                "Test query",
                top_k=3,
                similarity_threshold=0.8,
                document_ids=["doc1", "doc2"],
                use_hybrid_search=False
            )
            
            assert isinstance(result, RAGResponse)
            assert result.answer == "Filtered response"
    
    @pytest.mark.asyncio
    async def test_get_document_info(self, mock_vector_store, mock_embedding_service):
        """Test getting document information."""
        # Mock vector store to return document chunks
        mock_vector_store.get_document_chunks = AsyncMock(return_value=[
            {
                "chunk_id": "doc1_0",
                "content": "Test chunk 1",
                "token_count": 10,
                "metadata": {"test": True}
            },
            {
                "chunk_id": "doc1_1", 
                "content": "Test chunk 2",
                "token_count": 15,
                "metadata": {"test": True}
            }
        ])
        
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        result = await engine.get_document_info("doc1")
        
        assert result["document_id"] == "doc1"
        assert result["total_chunks"] == 2
        assert result["total_tokens"] == 25
        assert result["total_characters"] > 0
    
    @pytest.mark.asyncio
    async def test_get_document_info_not_found(self, mock_vector_store, mock_embedding_service):
        """Test getting info for non-existent document."""
        mock_vector_store.get_document_chunks = AsyncMock(return_value=[])
        
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        result = await engine.get_document_info("nonexistent")
        
        assert "error" in result
        assert "not found" in result["error"]
    
    @pytest.mark.asyncio
    async def test_delete_document(self, mock_vector_store, mock_embedding_service):
        """Test deleting a document."""
        mock_vector_store.delete_document = AsyncMock(return_value=5)
        
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        result = await engine.delete_document("doc1")
        
        assert result["document_id"] == "doc1"
        assert result["deleted_chunks"] == 5
        assert result["success"] == True
    
    @pytest.mark.asyncio
    async def test_get_collection_stats(self, mock_vector_store, mock_embedding_service):
        """Test getting collection statistics."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        stats = await engine.get_collection_stats()
        
        assert "total_chunks" in stats
        assert "total_documents" in stats
        assert "total_tokens" in stats
        assert isinstance(stats["total_chunks"], int)
    
    @pytest.mark.asyncio
    async def test_search_documents(self, mock_vector_store, mock_embedding_service):
        """Test searching documents without generating an answer."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        results = await engine.search_documents("test query", top_k=3)
        
        assert isinstance(results, list)
        assert len(results) > 0
        for result in results:
            assert "content" in result
            assert "similarity" in result
    
    @pytest.mark.asyncio
    async def test_query_openai_error(self, mock_vector_store, mock_embedding_service):
        """Test query when OpenAI API fails."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        # Mock OpenAI to raise an exception
        with patch.object(engine, 'openai_client') as mock_client:
            mock_client.chat.completions.create = AsyncMock(side_effect=Exception("API Error"))
            
            result = await engine.query("Test query")
            
            assert isinstance(result, RAGResponse)
            assert "error" in result.answer.lower()
            assert result.token_usage["total_tokens"] == 0
    
    @pytest.mark.asyncio
    async def test_close_engine(self, mock_vector_store, mock_embedding_service):
        """Test closing the RAG engine."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        # Should not raise any exceptions
        await engine.close()
    
    @pytest.mark.asyncio
    async def test_custom_system_prompt(self, mock_vector_store, mock_embedding_service):
        """Test that the system prompt is used correctly."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        assert "helpful AI assistant" in engine.system_prompt
        assert "context" in engine.system_prompt
        assert "sources" in engine.system_prompt.lower()
    
    @pytest.mark.asyncio
    async def test_batch_ingestion(self, mock_vector_store, mock_embedding_service, sample_files):
        """Test ingestion with different batch sizes."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        file_paths = list(sample_files.values())
        
        # Test with small batch size
        results = await engine.ingest_documents(file_paths, batch_size=1)
        
        assert results["processed_documents"] == len(file_paths)
        assert results["total_chunks"] > 0
    
    @pytest.mark.asyncio
    async def test_ingest_with_custom_document_ids(self, mock_vector_store, mock_embedding_service, sample_files):
        """Test ingestion with custom document IDs."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        
        file_paths = list(sample_files.values())
        document_ids = ["custom_doc_1", "custom_doc_2", "custom_doc_3"]
        
        results = await engine.ingest_documents(file_paths, document_ids=document_ids)
        
        assert results["processed_documents"] == len(file_paths)
        
        # Check that custom IDs were used in the vector store
        assert len(mock_vector_store.chunks) > 0
        for chunk in mock_vector_store.chunks:
            assert chunk.metadata["document_id"] in document_ids