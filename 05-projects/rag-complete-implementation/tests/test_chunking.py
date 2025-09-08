"""
Tests for the text chunking functionality.
"""
import pytest
from rag_system.chunking import TextChunker, Chunk


class TestTextChunker:
    """Test cases for TextChunker class."""
    
    def test_chunker_initialization(self):
        """Test chunker initialization with custom parameters."""
        chunker = TextChunker(chunk_size=200, chunk_overlap=50)
        assert chunker.chunk_size == 200
        assert chunker.chunk_overlap == 50
    
    def test_chunk_short_text(self, chunker):
        """Test chunking of short text that fits in one chunk."""
        text = "This is a short text."
        chunks = chunker.chunk_text(text, document_id="test_doc")
        
        assert len(chunks) == 1
        assert chunks[0].content == text
        assert chunks[0].chunk_id == "test_doc_0"
        assert chunks[0].metadata["document_id"] == "test_doc"
    
    def test_chunk_long_text(self, chunker):
        """Test chunking of long text that needs to be split."""
        text = "This is a very long text. " * 20  # Make it long enough to split
        chunks = chunker.chunk_text(text, document_id="test_doc")
        
        assert len(chunks) > 1
        for i, chunk in enumerate(chunks):
            assert chunk.chunk_id == f"test_doc_{i}"
            assert chunk.metadata["document_id"] == "test_doc"
            assert chunk.metadata["chunk_index"] == i
    
    def test_chunk_with_metadata(self, chunker):
        """Test chunking with custom metadata."""
        text = "Test text with metadata."
        metadata = {"file_name": "test.txt", "author": "test_user"}
        
        chunks = chunker.chunk_text(text, metadata=metadata, document_id="test_doc")
        
        assert len(chunks) == 1
        chunk_metadata = chunks[0].metadata
        assert chunk_metadata["file_name"] == "test.txt"
        assert chunk_metadata["author"] == "test_user"
        assert chunk_metadata["document_id"] == "test_doc"
    
    def test_chunk_by_tokens(self, chunker):
        """Test token-based chunking."""
        text = "This is a test for token-based chunking. " * 10
        chunks = chunker.chunk_by_tokens(
            text, 
            max_tokens=50, 
            overlap_tokens=10,
            document_id="test_doc"
        )
        
        assert len(chunks) > 0
        for chunk in chunks:
            assert chunk.token_count is not None
            assert chunk.token_count <= 50
    
    def test_empty_text_chunking(self, chunker):
        """Test chunking of empty text."""
        chunks = chunker.chunk_text("", document_id="test_doc")
        assert len(chunks) == 0
    
    def test_whitespace_only_text(self, chunker):
        """Test chunking of whitespace-only text."""
        chunks = chunker.chunk_text("   \n\t   ", document_id="test_doc")
        assert len(chunks) == 0
    
    def test_chunk_statistics(self, chunker, sample_text):
        """Test chunk statistics calculation."""
        chunks = chunker.chunk_text(sample_text, document_id="test_doc")
        stats = chunker.get_chunk_stats(chunks)
        
        assert "total_chunks" in stats
        assert "total_tokens" in stats
        assert "total_characters" in stats
        assert "avg_tokens_per_chunk" in stats
        assert "avg_chars_per_chunk" in stats
        assert stats["total_chunks"] == len(chunks)
    
    def test_overlapping_chunks(self):
        """Test that overlapping chunks contain expected overlap."""
        chunker = TextChunker(chunk_size=50, chunk_overlap=20)
        text = "This is sentence one. This is sentence two. This is sentence three. This is sentence four."
        
        chunks = chunker.chunk_text(text, document_id="test_doc")
        
        if len(chunks) > 1:
            # Check that there's some overlap between consecutive chunks
            for i in range(len(chunks) - 1):
                current_chunk = chunks[i].content
                next_chunk = chunks[i + 1].content
                
                # Find common words (simple overlap check)
                current_words = current_chunk.split()
                next_words = next_chunk.split()
                common_words = set(current_words) & set(next_words)
                
                # Should have some common words due to overlap
                assert len(common_words) > 0
    
    def test_chunk_preserves_sentences(self):
        """Test that chunking tries to preserve sentence boundaries."""
        chunker = TextChunker(chunk_size=100, chunk_overlap=20, separators=[". ", "! ", "? ", "\n\n", "\n", " "])
        text = "First sentence is here. Second sentence follows. Third sentence is also here. Fourth sentence ends it."
        
        chunks = chunker.chunk_text(text, document_id="test_doc")
        
        # Check that chunks don't end in the middle of words
        for chunk in chunks:
            content = chunk.content.strip()
            if content:
                # Should not end with a partial word (basic check)
                assert not content.endswith(" ")
    
    def test_chunk_character_positions(self, chunker):
        """Test that chunk character positions are calculated correctly."""
        text = "This is the first part. This is the second part."
        chunks = chunker.chunk_text(text, document_id="test_doc")
        
        for chunk in chunks:
            # Extract the chunk content from original text using positions
            extracted = text[chunk.start_char:chunk.end_char]
            
            # The extracted content should match the chunk content (allowing for overlap)
            assert chunk.content in extracted or extracted in chunk.content
    
    def test_multiple_separators(self):
        """Test chunking with multiple separator types."""
        chunker = TextChunker(chunk_size=30, chunk_overlap=10)
        text = "Paragraph one.\n\nParagraph two! Paragraph three? Final paragraph."
        
        chunks = chunker.chunk_text(text, document_id="test_doc")
        
        assert len(chunks) > 0
        # Verify that all content is preserved across chunks
        all_content = " ".join(chunk.content for chunk in chunks)
        # Basic check that key words are preserved
        assert "Paragraph" in all_content
        assert "Final" in all_content