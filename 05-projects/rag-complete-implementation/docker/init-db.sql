-- Initialize database with pgvector extension and required tables

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id VARCHAR(255) UNIQUE NOT NULL,
    document_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    token_count INTEGER,
    start_char INTEGER,
    end_char INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_document_id ON documents (document_id);
CREATE INDEX IF NOT EXISTS idx_documents_chunk_id ON documents (chunk_id);
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_documents_metadata ON documents USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at DESC);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO documents (chunk_id, document_id, content, metadata, token_count, start_char, end_char) VALUES
('sample_1', 'sample_doc_1', 'This is a sample document chunk for testing the RAG system.', '{"file_name": "sample.txt", "file_type": "txt"}', 12, 0, 60),
('sample_2', 'sample_doc_1', 'Another chunk from the same document to demonstrate chunking.', '{"file_name": "sample.txt", "file_type": "txt"}', 11, 61, 125)
ON CONFLICT (chunk_id) DO NOTHING;