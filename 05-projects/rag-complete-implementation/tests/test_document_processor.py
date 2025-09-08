"""
Tests for the document processing functionality.
"""
import pytest
import os
from pathlib import Path
from rag_system.document_processor import DocumentProcessor


class TestDocumentProcessor:
    """Test cases for DocumentProcessor class."""
    
    def test_is_supported_formats(self, document_processor):
        """Test supported file format detection."""
        assert document_processor.is_supported("test.pdf") == True
        assert document_processor.is_supported("test.txt") == True
        assert document_processor.is_supported("test.md") == True
        assert document_processor.is_supported("test.docx") == True
        assert document_processor.is_supported("test.html") == True
        assert document_processor.is_supported("test.htm") == True
        
        # Unsupported formats
        assert document_processor.is_supported("test.jpg") == False
        assert document_processor.is_supported("test.mp3") == False
        assert document_processor.is_supported("test.xlsx") == False
    
    @pytest.mark.asyncio
    async def test_process_text_file(self, document_processor, sample_files):
        """Test processing a text file."""
        processed_doc = await document_processor.process_file(sample_files['txt'])
        
        assert processed_doc.content
        assert "sample text file" in processed_doc.content
        assert processed_doc.file_type == ".txt"
        assert processed_doc.metadata["file_name"] == "sample.txt"
        assert processed_doc.metadata["file_size"] > 0
        assert processed_doc.metadata["content_length"] > 0
        assert processed_doc.metadata["word_count"] > 0
    
    @pytest.mark.asyncio
    async def test_process_markdown_file(self, document_processor, sample_files):
        """Test processing a markdown file."""
        processed_doc = await document_processor.process_file(sample_files['md'])
        
        assert processed_doc.content
        assert "Sample Markdown" in processed_doc.content
        assert processed_doc.file_type == ".md"
        assert processed_doc.metadata["file_name"] == "sample.md"
    
    @pytest.mark.asyncio
    async def test_process_html_file(self, document_processor, sample_files):
        """Test processing an HTML file."""
        processed_doc = await document_processor.process_file(sample_files['html'])
        
        assert processed_doc.content
        assert "Sample HTML Document" in processed_doc.content
        # HTML tags should be stripped
        assert "<html>" not in processed_doc.content
        assert "<body>" not in processed_doc.content
        assert processed_doc.file_type == ".html"
        assert processed_doc.metadata["file_name"] == "sample.html"
    
    @pytest.mark.asyncio
    async def test_process_nonexistent_file(self, document_processor):
        """Test processing a file that doesn't exist."""
        with pytest.raises(FileNotFoundError):
            await document_processor.process_file("nonexistent.txt")
    
    @pytest.mark.asyncio
    async def test_process_unsupported_file(self, document_processor, temp_directory):
        """Test processing an unsupported file format."""
        unsupported_file = Path(temp_directory) / "test.xyz"
        unsupported_file.write_text("Test content")
        
        with pytest.raises(ValueError, match="Unsupported file format"):
            await document_processor.process_file(str(unsupported_file))
    
    @pytest.mark.asyncio
    async def test_process_directory(self, document_processor, temp_directory, sample_files):
        """Test processing all files in a directory."""
        # Create subdirectory with another file
        subdir = Path(temp_directory) / "subdir"
        subdir.mkdir()
        sub_file = subdir / "sub_sample.txt"
        sub_file.write_text("Subdirectory sample file")
        
        # Process directory recursively
        processed_docs = await document_processor.process_directory(
            temp_directory, recursive=True
        )
        
        assert len(processed_docs) >= 3  # At least the sample files
        
        # Check that subdirectory file was processed
        sub_doc = next((doc for doc in processed_docs if "sub_sample.txt" in doc.file_path), None)
        assert sub_doc is not None
    
    @pytest.mark.asyncio
    async def test_process_directory_non_recursive(self, document_processor, temp_directory, sample_files):
        """Test processing directory without recursion."""
        # Create subdirectory with another file
        subdir = Path(temp_directory) / "subdir"
        subdir.mkdir()
        sub_file = subdir / "sub_sample.txt"
        sub_file.write_text("Subdirectory sample file")
        
        # Process directory non-recursively
        processed_docs = await document_processor.process_directory(
            temp_directory, recursive=False
        )
        
        # Should not include subdirectory files
        sub_doc = next((doc for doc in processed_docs if "sub_sample.txt" in doc.file_path), None)
        assert sub_doc is None
    
    @pytest.mark.asyncio
    async def test_process_directory_with_max_files(self, document_processor, temp_directory, sample_files):
        """Test processing directory with file limit."""
        processed_docs = await document_processor.process_directory(
            temp_directory, max_files=2
        )
        
        assert len(processed_docs) <= 2
    
    @pytest.mark.asyncio
    async def test_chunk_document(self, document_processor):
        """Test chunking a processed document."""
        from rag_system.document_processor import ProcessedDocument
        
        # Create a processed document
        long_content = "This is a sentence. " * 20  # Make it long enough to chunk
        processed_doc = ProcessedDocument(
            content=long_content,
            metadata={"test": True},
            file_path="test.txt",
            file_type=".txt"
        )
        
        # Chunk the document
        chunked_doc = await document_processor.chunk_document(processed_doc, "test_doc")
        
        assert chunked_doc.chunks is not None
        assert len(chunked_doc.chunks) > 0
        
        for chunk in chunked_doc.chunks:
            assert chunk.content
            assert chunk.chunk_id.startswith("test_doc_")
            assert chunk.metadata["test"] == True
    
    @pytest.mark.asyncio
    async def test_process_and_chunk_file(self, document_processor, sample_files):
        """Test processing and chunking in one step."""
        processed_doc = await document_processor.process_and_chunk_file(
            sample_files['txt'], 
            document_id="test_combined"
        )
        
        assert processed_doc.content
        assert processed_doc.chunks is not None
        assert len(processed_doc.chunks) > 0
        
        for chunk in processed_doc.chunks:
            assert chunk.chunk_id.startswith("test_combined_")
    
    def test_get_processing_stats(self, document_processor):
        """Test processing statistics calculation."""
        from rag_system.document_processor import ProcessedDocument
        from rag_system.chunking import Chunk
        
        # Create mock processed documents
        docs = [
            ProcessedDocument(
                content="Test content 1",
                metadata={"word_count": 3},
                file_path="test1.txt",
                file_type=".txt",
                chunks=[
                    Chunk("chunk1", 0, 10, "doc1_0", {"test": True}),
                    Chunk("chunk2", 10, 20, "doc1_1", {"test": True})
                ]
            ),
            ProcessedDocument(
                content="Test content 2 longer",
                metadata={"word_count": 4},
                file_path="test2.txt", 
                file_type=".txt",
                chunks=[
                    Chunk("chunk3", 0, 15, "doc2_0", {"test": True})
                ]
            )
        ]
        
        stats = document_processor.get_processing_stats(docs)
        
        assert stats["total_files"] == 2
        assert stats["total_word_count"] == 7
        assert stats["total_chunks"] == 3
        assert stats["avg_chunks_per_document"] == 1.5
        assert stats["file_types"][".txt"] == 2
    
    def test_get_processing_stats_empty(self, document_processor):
        """Test processing statistics with empty document list."""
        stats = document_processor.get_processing_stats([])
        assert stats == {}
    
    @pytest.mark.asyncio
    async def test_concurrent_processing(self, document_processor, sample_files):
        """Test concurrent processing of multiple files."""
        # Process all sample files concurrently
        file_paths = list(sample_files.values())
        
        # Since process_directory uses semaphore, this tests the concurrency control
        processed_docs = []
        for file_path in file_paths:
            doc = await document_processor.process_file(file_path)
            processed_docs.append(doc)
        
        assert len(processed_docs) == len(file_paths)
        
        # Verify each document was processed correctly
        for doc in processed_docs:
            assert doc.content
            assert doc.metadata["file_name"]
            assert doc.file_type
    
    @pytest.mark.asyncio
    async def test_extract_metadata(self, document_processor, sample_files):
        """Test that proper metadata is extracted from files."""
        processed_doc = await document_processor.process_file(sample_files['txt'])
        
        metadata = processed_doc.metadata
        
        # Check required metadata fields
        assert "file_name" in metadata
        assert "file_path" in metadata
        assert "file_size" in metadata
        assert "modified_time" in metadata
        assert "file_extension" in metadata
        assert "content_length" in metadata
        assert "word_count" in metadata
        
        # Verify values
        assert metadata["file_name"] == "sample.txt"
        assert metadata["file_extension"] == ".txt"
        assert metadata["file_size"] > 0
        assert metadata["content_length"] > 0
        assert metadata["word_count"] > 0