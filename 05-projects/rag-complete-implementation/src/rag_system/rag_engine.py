"""
Main RAG engine that orchestrates document processing, embeddings, and retrieval.
"""
import asyncio
import uuid
from typing import List, Dict, Any, Optional, Tuple, Union
from dataclasses import dataclass, asdict
from datetime import datetime
import logging
from openai import AsyncOpenAI

from .document_processor import DocumentProcessor, ProcessedDocument
from .embeddings import EmbeddingService
from .vector_store import SupabaseVectorStore
from .chunking import TextChunker, Chunk
from config.settings import settings


logger = logging.getLogger(__name__)


@dataclass
class RAGResponse:
    """Response from RAG system including answer and citations."""
    
    answer: str
    sources: List[Dict[str, Any]]
    query: str
    response_time: float
    token_usage: Dict[str, int]
    confidence_score: Optional[float] = None


@dataclass
class Citation:
    """Citation information for a source document."""
    
    document_id: str
    chunk_id: str
    content: str
    similarity_score: float
    metadata: Dict[str, Any]


class RAGEngine:
    """Main RAG engine orchestrating all components."""
    
    def __init__(
        self,
        vector_store: Optional[SupabaseVectorStore] = None,
        embedding_service: Optional[EmbeddingService] = None,
        document_processor: Optional[DocumentProcessor] = None,
        openai_api_key: Optional[str] = None
    ):
        """
        Initialize the RAG engine.
        
        Args:
            vector_store: Vector store instance
            embedding_service: Embedding service instance
            document_processor: Document processor instance
            openai_api_key: OpenAI API key
        """
        self.vector_store = vector_store or SupabaseVectorStore()
        self.embedding_service = embedding_service or EmbeddingService()
        self.document_processor = document_processor or DocumentProcessor()
        
        # Initialize OpenAI client for LLM calls
        self.openai_client = AsyncOpenAI(
            api_key=openai_api_key or settings.openai.api_key
        )
        
        # System prompt for RAG responses
        self.system_prompt = """You are a helpful AI assistant that answers questions based on the provided context. 

Instructions:
1. Answer the question using only the information provided in the context
2. If the context doesn't contain enough information to answer the question, say so clearly
3. Include specific references to the sources when making claims
4. Be concise but comprehensive in your response
5. If there are conflicting pieces of information in the context, acknowledge this

Context will be provided as numbered sources. Reference them as [Source 1], [Source 2], etc. in your response."""
    
    async def initialize(self):
        """Initialize the RAG engine and database."""
        await self.vector_store.initialize_database()
        logger.info("RAG engine initialized successfully")
    
    async def ingest_documents(
        self,
        file_paths: Union[str, List[str]],
        document_ids: Optional[Union[str, List[str]]] = None,
        batch_size: int = 50
    ) -> Dict[str, Any]:
        """
        Ingest documents into the RAG system.
        
        Args:
            file_paths: Single file path or list of file paths
            document_ids: Custom document IDs (optional)
            batch_size: Batch size for processing
            
        Returns:
            Dictionary with ingestion results
        """
        start_time = datetime.now()
        
        # Convert single file path to list
        if isinstance(file_paths, str):
            file_paths = [file_paths]
        
        # Handle document IDs
        if document_ids is None:
            document_ids = [None] * len(file_paths)
        elif isinstance(document_ids, str):
            document_ids = [document_ids]
        
        if len(file_paths) != len(document_ids):
            raise ValueError("Number of file paths must match number of document IDs")
        
        results = {
            "processed_documents": 0,
            "total_chunks": 0,
            "failed_documents": [],
            "processing_time": 0,
            "document_stats": {}
        }
        
        # Process documents
        processed_docs = []
        for file_path, doc_id in zip(file_paths, document_ids):
            try:
                processed_doc = await self.document_processor.process_and_chunk_file(
                    file_path, doc_id
                )
                processed_docs.append(processed_doc)
                results["processed_documents"] += 1
                results["total_chunks"] += len(processed_doc.chunks or [])
            except Exception as e:
                logger.error(f"Failed to process {file_path}: {str(e)}")
                results["failed_documents"].append({
                    "file_path": file_path,
                    "error": str(e)
                })
        
        if not processed_docs:
            logger.warning("No documents were successfully processed")
            return results
        
        # Generate embeddings in batches
        all_chunks = []
        for doc in processed_docs:
            if doc.chunks:
                all_chunks.extend(doc.chunks)
        
        if not all_chunks:
            logger.warning("No chunks were generated from documents")
            return results
        
        # Extract text content for embedding
        chunk_texts = [chunk.content for chunk in all_chunks]
        
        # Generate embeddings in batches
        logger.info(f"Generating embeddings for {len(chunk_texts)} chunks")
        embeddings = await self.embedding_service.batch_embed(
            chunk_texts, batch_size=batch_size
        )
        
        # Store in vector database
        logger.info("Storing chunks and embeddings in vector database")
        await self.vector_store.add_chunks(all_chunks, embeddings)
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        results["processing_time"] = processing_time
        
        # Get document statistics
        results["document_stats"] = self.document_processor.get_processing_stats(processed_docs)
        
        logger.info(f"Ingestion completed: {results['processed_documents']} documents, "
                   f"{results['total_chunks']} chunks in {processing_time:.2f}s")
        
        return results
    
    async def ingest_directory(
        self,
        directory_path: str,
        recursive: bool = True,
        max_files: Optional[int] = None,
        batch_size: int = 50
    ) -> Dict[str, Any]:
        """
        Ingest all supported documents from a directory.
        
        Args:
            directory_path: Path to directory
            recursive: Process subdirectories
            max_files: Maximum files to process
            batch_size: Batch size for processing
            
        Returns:
            Dictionary with ingestion results
        """
        logger.info(f"Starting directory ingestion: {directory_path}")
        
        # Process all documents in directory
        processed_docs = await self.document_processor.process_directory(
            directory_path, recursive=recursive, max_files=max_files
        )
        
        if not processed_docs:
            return {"error": "No supported documents found in directory"}
        
        # Chunk all documents
        chunked_docs = []
        for doc in processed_docs:
            doc_id = doc.metadata.get("file_name", str(uuid.uuid4()))
            chunked_doc = await self.document_processor.chunk_document(doc, doc_id)
            chunked_docs.append(chunked_doc)
        
        # Generate embeddings and store
        all_chunks = []
        for doc in chunked_docs:
            if doc.chunks:
                all_chunks.extend(doc.chunks)
        
        if not all_chunks:
            return {"error": "No chunks generated from documents"}
        
        chunk_texts = [chunk.content for chunk in all_chunks]
        embeddings = await self.embedding_service.batch_embed(
            chunk_texts, batch_size=batch_size
        )
        
        await self.vector_store.add_chunks(all_chunks, embeddings)
        
        return {
            "processed_documents": len(processed_docs),
            "total_chunks": len(all_chunks),
            "document_stats": self.document_processor.get_processing_stats(processed_docs)
        }
    
    async def query(
        self,
        question: str,
        top_k: int = None,
        similarity_threshold: float = None,
        document_ids: Optional[List[str]] = None,
        use_hybrid_search: bool = True
    ) -> RAGResponse:
        """
        Query the RAG system and get an answer with citations.
        
        Args:
            question: The question to answer
            top_k: Number of similar chunks to retrieve
            similarity_threshold: Minimum similarity score
            document_ids: Filter by specific document IDs
            use_hybrid_search: Use hybrid vector + text search
            
        Returns:
            RAGResponse with answer and sources
        """
        start_time = datetime.now()
        
        # Use default values from settings
        top_k = top_k or settings.retrieval.top_k
        similarity_threshold = similarity_threshold or settings.retrieval.similarity_threshold
        
        # Generate query embedding
        query_embedding = await self.embedding_service.embed_text(question)
        
        # Retrieve similar chunks
        if use_hybrid_search:
            similar_chunks = await self.vector_store.hybrid_search(
                query_embedding=query_embedding,
                query_text=question,
                top_k=top_k
            )
        else:
            similar_chunks = await self.vector_store.similarity_search(
                query_embedding=query_embedding,
                top_k=top_k,
                similarity_threshold=similarity_threshold,
                document_ids=document_ids
            )
        
        if not similar_chunks:
            return RAGResponse(
                answer="I couldn't find any relevant information to answer your question.",
                sources=[],
                query=question,
                response_time=(datetime.now() - start_time).total_seconds(),
                token_usage={"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            )
        
        # Create context from retrieved chunks
        context_parts = []
        citations = []
        
        for i, chunk in enumerate(similar_chunks, 1):
            context_parts.append(f"Source {i}:\n{chunk['content']}\n")
            
            citations.append(Citation(
                document_id=chunk["document_id"],
                chunk_id=chunk["chunk_id"],
                content=chunk["content"],
                similarity_score=chunk.get("similarity", chunk.get("combined_score", 0)),
                metadata=chunk["metadata"]
            ))
        
        context = "\n".join(context_parts)
        
        # Generate response using LLM
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Question: {question}\n\nContext:\n{context}"}
        ]
        
        try:
            response = await self.openai_client.chat.completions.create(
                model=settings.openai.chat_model,
                messages=messages,
                max_tokens=settings.openai.max_tokens,
                temperature=settings.openai.temperature
            )
            
            answer = response.choices[0].message.content
            token_usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
            
        except Exception as e:
            logger.error(f"Failed to generate LLM response: {str(e)}")
            return RAGResponse(
                answer="I encountered an error while generating the response.",
                sources=[asdict(citation) for citation in citations],
                query=question,
                response_time=(datetime.now() - start_time).total_seconds(),
                token_usage={"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            )
        
        response_time = (datetime.now() - start_time).total_seconds()
        
        return RAGResponse(
            answer=answer,
            sources=[asdict(citation) for citation in citations],
            query=question,
            response_time=response_time,
            token_usage=token_usage
        )
    
    async def get_document_info(self, document_id: str) -> Dict[str, Any]:
        """
        Get information about a specific document.
        
        Args:
            document_id: The document ID
            
        Returns:
            Dictionary with document information
        """
        chunks = await self.vector_store.get_document_chunks(document_id)
        
        if not chunks:
            return {"error": f"Document {document_id} not found"}
        
        # Calculate statistics
        total_tokens = sum(chunk.get("token_count", 0) for chunk in chunks)
        total_chars = sum(len(chunk["content"]) for chunk in chunks)
        
        return {
            "document_id": document_id,
            "total_chunks": len(chunks),
            "total_tokens": total_tokens,
            "total_characters": total_chars,
            "metadata": chunks[0]["metadata"] if chunks else {},
            "chunks": chunks
        }
    
    async def delete_document(self, document_id: str) -> Dict[str, Any]:
        """
        Delete a document and all its chunks.
        
        Args:
            document_id: The document ID to delete
            
        Returns:
            Dictionary with deletion results
        """
        deleted_count = await self.vector_store.delete_document(document_id)
        
        return {
            "document_id": document_id,
            "deleted_chunks": deleted_count,
            "success": deleted_count > 0
        }
    
    async def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the entire collection.
        
        Returns:
            Dictionary with collection statistics
        """
        return await self.vector_store.get_collection_stats()
    
    async def search_documents(
        self,
        query: str,
        top_k: int = 10,
        similarity_threshold: float = 0.5
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents without generating an answer.
        
        Args:
            query: Search query
            top_k: Number of results to return
            similarity_threshold: Minimum similarity score
            
        Returns:
            List of similar chunks
        """
        query_embedding = await self.embedding_service.embed_text(query)
        
        return await self.vector_store.similarity_search(
            query_embedding=query_embedding,
            top_k=top_k,
            similarity_threshold=similarity_threshold
        )
    
    async def close(self):
        """Close all connections and cleanup resources."""
        await self.vector_store.close()
        logger.info("RAG engine closed")