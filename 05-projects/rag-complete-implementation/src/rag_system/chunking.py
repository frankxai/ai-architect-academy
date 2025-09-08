"""
Text chunking utilities for splitting documents into manageable pieces.
"""
import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import tiktoken
from config.settings import settings


@dataclass
class Chunk:
    """Represents a text chunk with metadata."""
    
    content: str
    start_char: int
    end_char: int
    chunk_id: str
    metadata: Dict[str, Any]
    token_count: Optional[int] = None


class TextChunker:
    """Advanced text chunking with overlapping and semantic awareness."""
    
    def __init__(
        self,
        chunk_size: int = None,
        chunk_overlap: int = None,
        separators: List[str] = None
    ):
        """
        Initialize the text chunker.
        
        Args:
            chunk_size: Target size for each chunk in characters
            chunk_overlap: Number of characters to overlap between chunks
            separators: List of separators to use for splitting, in order of preference
        """
        self.chunk_size = chunk_size or settings.chunking.size
        self.chunk_overlap = chunk_overlap or settings.chunking.overlap
        self.separators = separators or settings.chunking.separators
        self.encoding = tiktoken.get_encoding("cl100k_base")
    
    def chunk_text(
        self,
        text: str,
        metadata: Dict[str, Any] = None,
        document_id: str = None
    ) -> List[Chunk]:
        """
        Chunk text into overlapping segments.
        
        Args:
            text: Text to chunk
            metadata: Metadata to attach to chunks
            document_id: Unique identifier for the document
            
        Returns:
            List of Chunk objects
        """
        if not text.strip():
            return []
        
        metadata = metadata or {}
        chunks = []
        
        # First, try to split by paragraphs if text is long enough
        if len(text) > self.chunk_size * 2:
            paragraph_chunks = self._split_by_paragraphs(text)
        else:
            paragraph_chunks = [text]
        
        chunk_index = 0
        for para_chunk in paragraph_chunks:
            para_chunks = self._recursive_split(para_chunk, self.chunk_size)
            
            for i, chunk_text in enumerate(para_chunks):
                if not chunk_text.strip():
                    continue
                
                # Calculate character positions
                start_char = text.find(chunk_text)
                end_char = start_char + len(chunk_text)
                
                # Generate chunk ID
                chunk_id = f"{document_id}_{chunk_index}" if document_id else f"chunk_{chunk_index}"
                
                # Count tokens
                token_count = len(self.encoding.encode(chunk_text))
                
                # Create chunk with metadata
                chunk_metadata = {
                    **metadata,
                    "chunk_index": chunk_index,
                    "document_id": document_id,
                    "total_chunks": len(para_chunks),
                }
                
                chunk = Chunk(
                    content=chunk_text.strip(),
                    start_char=start_char,
                    end_char=end_char,
                    chunk_id=chunk_id,
                    metadata=chunk_metadata,
                    token_count=token_count
                )
                
                chunks.append(chunk)
                chunk_index += 1
        
        return self._add_overlap(chunks, text)
    
    def _split_by_paragraphs(self, text: str) -> List[str]:
        """Split text by paragraphs first."""
        paragraphs = re.split(r'\n\s*\n', text)
        return [p.strip() for p in paragraphs if p.strip()]
    
    def _recursive_split(self, text: str, chunk_size: int) -> List[str]:
        """
        Recursively split text using different separators.
        
        Args:
            text: Text to split
            chunk_size: Target chunk size
            
        Returns:
            List of text chunks
        """
        if len(text) <= chunk_size:
            return [text]
        
        # Try each separator in order
        for separator in self.separators:
            if separator in text:
                splits = text.split(separator)
                if len(splits) > 1:
                    return self._merge_splits(splits, separator, chunk_size)
        
        # If no separators work, split by character count
        return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    
    def _merge_splits(self, splits: List[str], separator: str, chunk_size: int) -> List[str]:
        """
        Merge splits back together to form chunks of appropriate size.
        
        Args:
            splits: List of text splits
            separator: The separator used
            chunk_size: Target chunk size
            
        Returns:
            List of merged chunks
        """
        chunks = []
        current_chunk = ""
        
        for split in splits:
            # Check if adding this split would exceed chunk size
            potential_chunk = current_chunk + separator + split if current_chunk else split
            
            if len(potential_chunk) <= chunk_size:
                current_chunk = potential_chunk
            else:
                # Save current chunk if it exists
                if current_chunk:
                    chunks.append(current_chunk)
                
                # If single split is too large, recursively split it
                if len(split) > chunk_size:
                    chunks.extend(self._recursive_split(split, chunk_size))
                    current_chunk = ""
                else:
                    current_chunk = split
        
        # Add remaining chunk
        if current_chunk:
            chunks.append(current_chunk)
        
        return chunks
    
    def _add_overlap(self, chunks: List[Chunk], original_text: str) -> List[Chunk]:
        """
        Add overlapping content between chunks.
        
        Args:
            chunks: List of chunks
            original_text: Original text
            
        Returns:
            List of chunks with overlap added
        """
        if len(chunks) <= 1 or self.chunk_overlap == 0:
            return chunks
        
        overlapped_chunks = []
        
        for i, chunk in enumerate(chunks):
            content = chunk.content
            
            # Add overlap from previous chunk
            if i > 0:
                prev_chunk = chunks[i - 1]
                overlap_start = max(0, len(prev_chunk.content) - self.chunk_overlap)
                overlap_text = prev_chunk.content[overlap_start:]
                content = overlap_text + " " + content
            
            # Add overlap from next chunk
            if i < len(chunks) - 1:
                next_chunk = chunks[i + 1]
                overlap_end = min(len(next_chunk.content), self.chunk_overlap)
                overlap_text = next_chunk.content[:overlap_end]
                content = content + " " + overlap_text
            
            # Update token count
            token_count = len(self.encoding.encode(content))
            
            overlapped_chunk = Chunk(
                content=content.strip(),
                start_char=chunk.start_char,
                end_char=chunk.end_char,
                chunk_id=chunk.chunk_id,
                metadata=chunk.metadata,
                token_count=token_count
            )
            
            overlapped_chunks.append(overlapped_chunk)
        
        return overlapped_chunks
    
    def chunk_by_tokens(
        self,
        text: str,
        max_tokens: int = 1000,
        overlap_tokens: int = 100,
        metadata: Dict[str, Any] = None,
        document_id: str = None
    ) -> List[Chunk]:
        """
        Chunk text based on token count rather than character count.
        
        Args:
            text: Text to chunk
            max_tokens: Maximum tokens per chunk
            overlap_tokens: Tokens to overlap between chunks
            metadata: Metadata to attach to chunks
            document_id: Unique identifier for the document
            
        Returns:
            List of Chunk objects
        """
        tokens = self.encoding.encode(text)
        chunks = []
        
        start_idx = 0
        chunk_index = 0
        
        while start_idx < len(tokens):
            # Define end index
            end_idx = min(start_idx + max_tokens, len(tokens))
            
            # Extract chunk tokens
            chunk_tokens = tokens[start_idx:end_idx]
            chunk_text = self.encoding.decode(chunk_tokens)
            
            # Calculate character positions (approximate)
            char_start = len(self.encoding.decode(tokens[:start_idx]))
            char_end = char_start + len(chunk_text)
            
            # Generate chunk ID
            chunk_id = f"{document_id}_{chunk_index}" if document_id else f"chunk_{chunk_index}"
            
            # Create chunk metadata
            chunk_metadata = {
                **(metadata or {}),
                "chunk_index": chunk_index,
                "document_id": document_id,
                "token_start": start_idx,
                "token_end": end_idx,
            }
            
            chunk = Chunk(
                content=chunk_text.strip(),
                start_char=char_start,
                end_char=char_end,
                chunk_id=chunk_id,
                metadata=chunk_metadata,
                token_count=len(chunk_tokens)
            )
            
            chunks.append(chunk)
            
            # Move start index, accounting for overlap
            start_idx = end_idx - overlap_tokens
            chunk_index += 1
        
        return chunks
    
    def get_chunk_stats(self, chunks: List[Chunk]) -> Dict[str, Any]:
        """
        Get statistics about the chunks.
        
        Args:
            chunks: List of chunks
            
        Returns:
            Dictionary with chunk statistics
        """
        if not chunks:
            return {}
        
        token_counts = [chunk.token_count or 0 for chunk in chunks]
        char_counts = [len(chunk.content) for chunk in chunks]
        
        return {
            "total_chunks": len(chunks),
            "total_tokens": sum(token_counts),
            "total_characters": sum(char_counts),
            "avg_tokens_per_chunk": sum(token_counts) / len(chunks),
            "avg_chars_per_chunk": sum(char_counts) / len(chunks),
            "min_tokens": min(token_counts) if token_counts else 0,
            "max_tokens": max(token_counts) if token_counts else 0,
            "min_chars": min(char_counts) if char_counts else 0,
            "max_chars": max(char_counts) if char_counts else 0,
        }