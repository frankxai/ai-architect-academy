#!/usr/bin/env python3
"""
Database setup script for RAG system.
Creates the required database tables and indexes for the vector store.
"""
import asyncio
import asyncpg
import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from config.settings import settings
from rag_system.vector_store import SupabaseVectorStore


async def create_database():
    """Create the database if it doesn't exist."""
    try:
        # Connect to default database to create our database
        admin_connection = await asyncpg.connect(
            host=settings.database.host,
            port=settings.database.port,
            user=settings.database.user,
            password=settings.database.password,
            database="postgres"  # Default database
        )
        
        # Check if database exists
        db_exists = await admin_connection.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            settings.database.name
        )
        
        if not db_exists:
            print(f"Creating database '{settings.database.name}'...")
            await admin_connection.execute(
                f"CREATE DATABASE {settings.database.name}"
            )
            print(f"Database '{settings.database.name}' created successfully!")
        else:
            print(f"Database '{settings.database.name}' already exists.")
        
        await admin_connection.close()
        
    except Exception as e:
        print(f"Error creating database: {str(e)}")
        return False
    
    return True


async def setup_tables():
    """Set up the required tables and indexes."""
    try:
        # Connect to our database
        connection = await asyncpg.connect(settings.database.connection_string)
        
        print("Setting up database tables and indexes...")
        
        # Enable pgvector extension
        print("Enabling pgvector extension...")
        await connection.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        await connection.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
        
        # Create documents table
        print("Creating documents table...")
        create_table_query = f"""
        CREATE TABLE IF NOT EXISTS {settings.supabase.table_name} (
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
        print("Creating indexes...")
        indexes = [
            f"CREATE INDEX IF NOT EXISTS idx_{settings.supabase.table_name}_document_id ON {settings.supabase.table_name} (document_id);",
            f"CREATE INDEX IF NOT EXISTS idx_{settings.supabase.table_name}_chunk_id ON {settings.supabase.table_name} (chunk_id);",
            f"CREATE INDEX IF NOT EXISTS idx_{settings.supabase.table_name}_embedding ON {settings.supabase.table_name} USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);",
            f"CREATE INDEX IF NOT EXISTS idx_{settings.supabase.table_name}_metadata ON {settings.supabase.table_name} USING GIN (metadata);",
            f"CREATE INDEX IF NOT EXISTS idx_{settings.supabase.table_name}_created_at ON {settings.supabase.table_name} (created_at DESC);"
        ]
        
        for index_query in indexes:
            await connection.execute(index_query)
        
        # Create function to update the updated_at column
        print("Creating update trigger...")
        await connection.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        """)
        
        # Create trigger to automatically update updated_at
        await connection.execute(f"""
        DROP TRIGGER IF EXISTS update_{settings.supabase.table_name}_updated_at ON {settings.supabase.table_name};
        CREATE TRIGGER update_{settings.supabase.table_name}_updated_at 
            BEFORE UPDATE ON {settings.supabase.table_name} 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
        """)
        
        await connection.close()
        print("Database setup completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error setting up tables: {str(e)}")
        return False


async def verify_setup():
    """Verify that the database setup is working correctly."""
    try:
        vector_store = SupabaseVectorStore()
        await vector_store.initialize_database()
        
        # Get collection stats to verify connection
        stats = await vector_store.get_collection_stats()
        print(f"Database verification successful!")
        print(f"Current stats: {stats}")
        
        await vector_store.close()
        return True
        
    except Exception as e:
        print(f"Database verification failed: {str(e)}")
        return False


async def insert_sample_data():
    """Insert sample data for testing."""
    try:
        from rag_system.chunking import TextChunker, Chunk
        from rag_system.embeddings import EmbeddingService
        
        print("Inserting sample data...")
        
        # Create sample chunks
        chunker = TextChunker()
        sample_text = """
        This is a sample document for testing the RAG system. 
        It contains multiple sentences that will be chunked and embedded.
        The system should be able to retrieve this content when queried.
        """
        
        chunks = chunker.chunk_text(
            sample_text, 
            metadata={"type": "sample", "created_by": "setup_script"},
            document_id="sample_doc_1"
        )
        
        if not chunks:
            print("No chunks created from sample text")
            return False
        
        # Generate embeddings (this requires OpenAI API key)
        try:
            embedding_service = EmbeddingService()
            texts = [chunk.content for chunk in chunks]
            embeddings = await embedding_service.batch_embed(texts)
        except Exception as e:
            print(f"Could not generate embeddings (OpenAI API key may be missing): {str(e)}")
            print("Inserting chunks without embeddings...")
            embeddings = [[0.0] * 1536 for _ in chunks]  # Dummy embeddings
        
        # Store in vector database
        vector_store = SupabaseVectorStore()
        await vector_store.initialize_database()
        
        chunk_ids = await vector_store.add_chunks(chunks, embeddings)
        print(f"Successfully inserted {len(chunk_ids)} sample chunks")
        
        await vector_store.close()
        return True
        
    except Exception as e:
        print(f"Error inserting sample data: {str(e)}")
        return False


async def main():
    """Main setup function."""
    print("=" * 50)
    print("RAG System Database Setup")
    print("=" * 50)
    
    # Check environment variables
    required_vars = ["DB_PASSWORD"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these variables and try again.")
        return False
    
    print(f"Database Host: {settings.database.host}")
    print(f"Database Port: {settings.database.port}")
    print(f"Database Name: {settings.database.name}")
    print(f"Database User: {settings.database.user}")
    print(f"Table Name: {settings.supabase.table_name}")
    print()
    
    # Step 1: Create database
    if not await create_database():
        print("Failed to create database. Exiting.")
        return False
    
    # Step 2: Setup tables and indexes
    if not await setup_tables():
        print("Failed to setup tables. Exiting.")
        return False
    
    # Step 3: Verify setup
    if not await verify_setup():
        print("Database verification failed. Exiting.")
        return False
    
    # Step 4: Insert sample data (optional)
    response = input("Would you like to insert sample data? (y/n): ")
    if response.lower() in ['y', 'yes']:
        await insert_sample_data()
    
    print("=" * 50)
    print("Database setup completed successfully!")
    print("=" * 50)
    
    return True


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)