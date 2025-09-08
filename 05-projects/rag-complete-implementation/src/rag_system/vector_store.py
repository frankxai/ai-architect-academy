"""
Vector store implementation using Supabase with pgvector extension.
"""
import asyncio
import uuid
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import numpy as np
from supabase import create_client, Client
import asyncpg
from dataclasses import asdict

from .chunking import Chunk
from config.settings import settings


class SupabaseVectorStore:
    """Vector store implementation using Supabase with pgvector."""
    
    def __init__(
        self,
        supabase_url: str = None,
        supabase_key: str = None,
        table_name: str = None
    ):
        """
        Initialize the Supabase vector store.
        
        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase service role key
            table_name: Table name for document storage
        """
        self.supabase_url = supabase_url or settings.supabase.url
        self.supabase_key = supabase_key or settings.supabase.key
        self.table_name = table_name or settings.supabase.table_name
        
        # Initialize Supabase client
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Connection pool for direct database operations
        self._connection_pool: Optional[asyncpg.Pool] = None
    
    async def _get_connection_pool(self) -> asyncpg.Pool:
        """Get or create the connection pool."""
        if self._connection_pool is None:
            # Extract connection details from Supabase URL
            db_url = self.supabase_url.replace('https://', 'postgresql://postgres:')
            db_url = db_url.replace('.supabase.co', '.supabase.co:5432')
            db_url += '/postgres'
            
            self._connection_pool = await asyncpg.create_pool(
                db_url,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
        
        return self._connection_pool
    
    async def initialize_database(self):
        """Initialize the database with required tables and extensions."""
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            # Enable pgvector extension
            await connection.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            
            # Create documents table
            create_table_query = f"""
            CREATE TABLE IF NOT EXISTS {self.table_name} (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                chunk_id VARCHAR(255) UNIQUE NOT NULL,
                document_id VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                embedding VECTOR(1536),
                metadata JSONB DEFAULT '{{}}',
                token_count INTEGER,
                start_char INTEGER,
                end_char INTEGER,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            await connection.execute(create_table_query)
            
            # Create indexes for better performance
            indexes = [
                f"CREATE INDEX IF NOT EXISTS idx_{self.table_name}_document_id ON {self.table_name} (document_id);",
                f"CREATE INDEX IF NOT EXISTS idx_{self.table_name}_chunk_id ON {self.table_name} (chunk_id);",
                f"CREATE INDEX IF NOT EXISTS idx_{self.table_name}_embedding ON {self.table_name} USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);",
                f"CREATE INDEX IF NOT EXISTS idx_{self.table_name}_metadata ON {self.table_name} USING GIN (metadata);",
                f"CREATE INDEX IF NOT EXISTS idx_{self.table_name}_created_at ON {self.table_name} (created_at DESC);"
            ]
            
            for index_query in indexes:
                await connection.execute(index_query)
    
    async def add_chunks(
        self,
        chunks: List[Chunk],
        embeddings: List[List[float]]
    ) -> List[str]:
        """
        Add chunks with their embeddings to the vector store.
        
        Args:
            chunks: List of Chunk objects
            embeddings: List of embedding vectors
            
        Returns:
            List of inserted document IDs
        """
        if len(chunks) != len(embeddings):
            raise ValueError("Number of chunks must match number of embeddings")
        
        pool = await self._get_connection_pool()
        inserted_ids = []
        
        async with pool.acquire() as connection:
            for chunk, embedding in zip(chunks, embeddings):
                # Prepare data for insertion
                data = {
                    "chunk_id": chunk.chunk_id,
                    "document_id": chunk.metadata.get("document_id", "unknown"),
                    "content": chunk.content,
                    "embedding": embedding,
                    "metadata": chunk.metadata,
                    "token_count": chunk.token_count,
                    "start_char": chunk.start_char,
                    "end_char": chunk.end_char
                }
                
                # Insert or update the chunk
                query = f"""
                INSERT INTO {self.table_name} 
                (chunk_id, document_id, content, embedding, metadata, token_count, start_char, end_char)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (chunk_id) 
                DO UPDATE SET 
                    content = EXCLUDED.content,
                    embedding = EXCLUDED.embedding,
                    metadata = EXCLUDED.metadata,
                    token_count = EXCLUDED.token_count,
                    start_char = EXCLUDED.start_char,
                    end_char = EXCLUDED.end_char,
                    updated_at = NOW()
                RETURNING id;
                """
                
                result = await connection.fetchrow(
                    query,
                    data["chunk_id"],
                    data["document_id"],
                    data["content"],
                    data["embedding"],
                    data["metadata"],
                    data["token_count"],
                    data["start_char"],
                    data["end_char"]
                )
                
                inserted_ids.append(str(result["id"]))
        
        return inserted_ids
    
    async def similarity_search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        similarity_threshold: float = 0.0,
        document_ids: Optional[List[str]] = None,
        metadata_filter: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform similarity search using vector embeddings.
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
            similarity_threshold: Minimum similarity score
            document_ids: Filter by specific document IDs
            metadata_filter: Filter by metadata fields
            
        Returns:
            List of similar documents with metadata
        """
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            # Build the query
            base_query = f"""
            SELECT 
                id,
                chunk_id,
                document_id,
                content,
                metadata,
                token_count,
                start_char,
                end_char,
                created_at,
                1 - (embedding <=> $1) AS similarity
            FROM {self.table_name}
            WHERE 1 - (embedding <=> $1) >= $2
            """
            
            params = [query_embedding, similarity_threshold]
            param_count = 2
            
            # Add document ID filter
            if document_ids:
                param_count += 1
                base_query += f" AND document_id = ANY(${param_count})"
                params.append(document_ids)
            
            # Add metadata filters
            if metadata_filter:
                for key, value in metadata_filter.items():
                    param_count += 1
                    base_query += f" AND metadata->>${param_count-1} = ${param_count}"
                    params.extend([key, str(value)])
                    param_count += 1
            
            # Order and limit
            base_query += f" ORDER BY similarity DESC LIMIT {top_k};"
            
            # Execute query
            results = await connection.fetch(base_query, *params)
            
            # Convert results to dictionaries
            search_results = []
            for row in results:
                result = {
                    "id": str(row["id"]),
                    "chunk_id": row["chunk_id"],
                    "document_id": row["document_id"],
                    "content": row["content"],
                    "metadata": row["metadata"],
                    "token_count": row["token_count"],
                    "start_char": row["start_char"],
                    "end_char": row["end_char"],
                    "similarity": float(row["similarity"]),
                    "created_at": row["created_at"]
                }
                search_results.append(result)
            
            return search_results
    
    async def get_document_chunks(self, document_id: str) -> List[Dict[str, Any]]:
        """
        Get all chunks for a specific document.
        
        Args:
            document_id: The document ID
            
        Returns:
            List of chunks for the document
        """
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            query = f"""
            SELECT 
                id, chunk_id, document_id, content, metadata,
                token_count, start_char, end_char, created_at
            FROM {self.table_name}
            WHERE document_id = $1
            ORDER BY start_char ASC;
            """
            
            results = await connection.fetch(query, document_id)
            
            return [
                {
                    "id": str(row["id"]),
                    "chunk_id": row["chunk_id"],
                    "document_id": row["document_id"],
                    "content": row["content"],
                    "metadata": row["metadata"],
                    "token_count": row["token_count"],
                    "start_char": row["start_char"],
                    "end_char": row["end_char"],
                    "created_at": row["created_at"]
                }
                for row in results
            ]
    
    async def delete_document(self, document_id: str) -> int:
        """
        Delete all chunks for a document.
        
        Args:
            document_id: The document ID to delete
            
        Returns:
            Number of deleted chunks
        """
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            query = f"DELETE FROM {self.table_name} WHERE document_id = $1;"
            result = await connection.execute(query, document_id)
            
            # Extract number from result string like "DELETE 5"
            return int(result.split()[-1])
    
    async def delete_chunk(self, chunk_id: str) -> bool:
        """
        Delete a specific chunk.
        
        Args:
            chunk_id: The chunk ID to delete
            
        Returns:
            True if chunk was deleted, False otherwise
        """
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            query = f"DELETE FROM {self.table_name} WHERE chunk_id = $1;"
            result = await connection.execute(query, chunk_id)
            
            return int(result.split()[-1]) > 0
    
    async def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the vector store collection.
        
        Returns:
            Dictionary with collection statistics
        """
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            stats_query = f"""
            SELECT 
                COUNT(*) as total_chunks,
                COUNT(DISTINCT document_id) as total_documents,
                AVG(token_count) as avg_tokens_per_chunk,
                MIN(created_at) as oldest_document,
                MAX(created_at) as newest_document,
                SUM(token_count) as total_tokens
            FROM {self.table_name};
            """
            
            result = await connection.fetchrow(stats_query)
            
            return {
                "total_chunks": result["total_chunks"],
                "total_documents": result["total_documents"],
                "avg_tokens_per_chunk": float(result["avg_tokens_per_chunk"]) if result["avg_tokens_per_chunk"] else 0,
                "total_tokens": result["total_tokens"] or 0,
                "oldest_document": result["oldest_document"],
                "newest_document": result["newest_document"]
            }
    
    async def hybrid_search(
        self,
        query_embedding: List[float],
        query_text: str,
        top_k: int = 5,
        similarity_weight: float = 0.7,
        text_weight: float = 0.3
    ) -> List[Dict[str, Any]]:
        """
        Perform hybrid search combining vector similarity and text search.
        
        Args:
            query_embedding: Query embedding vector
            query_text: Query text for text search
            top_k: Number of results to return
            similarity_weight: Weight for similarity score
            text_weight: Weight for text search score
            
        Returns:
            List of search results with combined scores
        """
        pool = await self._get_connection_pool()
        
        async with pool.acquire() as connection:
            query = f"""
            WITH vector_search AS (
                SELECT 
                    id, chunk_id, document_id, content, metadata,
                    token_count, start_char, end_char, created_at,
                    1 - (embedding <=> $1) AS vector_score
                FROM {self.table_name}
                ORDER BY embedding <=> $1
                LIMIT {top_k * 2}
            ),
            text_search AS (
                SELECT 
                    id, chunk_id, document_id, content, metadata,
                    token_count, start_char, end_char, created_at,
                    ts_rank_cd(to_tsvector('english', content), plainto_tsquery('english', $2)) AS text_score
                FROM {self.table_name}
                WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $2)
                ORDER BY text_score DESC
                LIMIT {top_k * 2}
            )
            SELECT 
                COALESCE(vs.id, ts.id) as id,
                COALESCE(vs.chunk_id, ts.chunk_id) as chunk_id,
                COALESCE(vs.document_id, ts.document_id) as document_id,
                COALESCE(vs.content, ts.content) as content,
                COALESCE(vs.metadata, ts.metadata) as metadata,
                COALESCE(vs.token_count, ts.token_count) as token_count,
                COALESCE(vs.start_char, ts.start_char) as start_char,
                COALESCE(vs.end_char, ts.end_char) as end_char,
                COALESCE(vs.created_at, ts.created_at) as created_at,
                COALESCE(vs.vector_score, 0) * $3 + COALESCE(ts.text_score, 0) * $4 AS combined_score
            FROM vector_search vs
            FULL OUTER JOIN text_search ts ON vs.id = ts.id
            ORDER BY combined_score DESC
            LIMIT {top_k};
            """
            
            results = await connection.fetch(
                query, query_embedding, query_text, similarity_weight, text_weight
            )
            
            return [
                {
                    "id": str(row["id"]),
                    "chunk_id": row["chunk_id"],
                    "document_id": row["document_id"],
                    "content": row["content"],
                    "metadata": row["metadata"],
                    "token_count": row["token_count"],
                    "start_char": row["start_char"],
                    "end_char": row["end_char"],
                    "combined_score": float(row["combined_score"]),
                    "created_at": row["created_at"]
                }
                for row in results
            ]
    
    async def close(self):
        """Close the connection pool."""
        if self._connection_pool:
            await self._connection_pool.close()