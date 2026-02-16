"""Tests for RAG Pipeline — all must pass to complete the lab."""
import pytest
from rag_pipeline import KnowledgeBase, Retriever, RAGPipeline, Document


class TestChunking:
    def test_large_documents_are_chunked(self):
        """Documents over 1000 chars should be split into multiple chunks."""
        kb = KnowledgeBase()
        kb.documents = [Document(content="x" * 3000, metadata={"id": "1"})]
        chunks = kb.chunk_documents()
        assert len(chunks) > 1, "Large documents must be split into multiple chunks"

    def test_chunks_have_overlap(self):
        """Chunks should overlap to preserve context at boundaries."""
        kb = KnowledgeBase()
        kb.documents = [Document(content="word " * 600, metadata={"id": "1"})]
        chunks = kb.chunk_documents()
        if len(chunks) > 1:
            chunk_0_tail = chunks[0].content[-100:]
            chunk_1_head = chunks[1].content[:200]
            overlap_found = any(
                word in chunk_1_head
                for word in chunk_0_tail.split()
                if len(word) > 2
            )
            assert overlap_found, "Chunks must have overlap for context preservation"

    def test_no_content_lost(self):
        """All original content must be preserved across chunks."""
        kb = KnowledgeBase()
        original = "The quick brown fox " * 200  # ~4000 chars
        kb.documents = [Document(content=original, metadata={"id": "1"})]
        chunks = kb.chunk_documents()
        combined = " ".join(c.content for c in chunks)
        assert "quick brown fox" in combined

    def test_small_documents_unchanged(self):
        """Documents smaller than chunk_size should pass through intact."""
        kb = KnowledgeBase()
        kb.documents = [Document(content="Short doc", metadata={"id": "1"})]
        chunks = kb.chunk_documents()
        assert len(chunks) == 1
        assert chunks[0].content == "Short doc"


class TestRetriever:
    def test_semantic_search_returns_results(self):
        """Semantic search should return documents ranked by similarity."""
        docs = [
            Document(content="Python programming guide",
                     metadata={}, embedding=[0.9, 0.1, 0.0]),
            Document(content="Cooking recipes collection",
                     metadata={}, embedding=[0.0, 0.1, 0.9]),
        ]
        retriever = Retriever(docs)
        results = retriever.search([0.9, 0.1, 0.0], top_k=2)
        assert len(results) > 0
        assert results[0].document.content == "Python programming guide"

    def test_exact_term_retrieval(self):
        """System should be able to find documents by exact terms like error codes."""
        docs = [
            Document(content="Error code E-4012: Reset your API key",
                     metadata={}, embedding=[0.1] * 384),
            Document(content="General troubleshooting guide for common issues",
                     metadata={}, embedding=[0.9] * 384),
        ]
        retriever = Retriever(docs)
        # A query about "E-4012" should find the error code doc even if
        # the embedding similarity doesn't favor it
        found = False
        if hasattr(retriever, 'hybrid_search'):
            results = retriever.hybrid_search("E-4012", [0.9] * 384, top_k=2)
            found = any("E-4012" in r.document.content for r in results)
        elif hasattr(retriever, 'keyword_search'):
            results = retriever.keyword_search("E-4012", top_k=2)
            found = any("E-4012" in r.document.content for r in results)
        else:
            pytest.fail("Retriever must support keyword_search or hybrid_search for exact matches")
        assert found, "Exact term 'E-4012' should be retrievable"


class TestPipeline:
    def test_context_length_sufficient(self):
        """Generated context must be long enough to contain useful information."""
        kb = KnowledgeBase()
        kb.documents = [
            Document(content="A" * 2000, metadata={"id": "1"}, embedding=[0.5] * 384)
        ]
        pipeline = RAGPipeline(kb)
        pipeline.build_index()
        answer = pipeline.generate_answer("test", [0.5] * 384)
        assert len(answer) > 1000, "Context window must be large enough for complete answers"

    def test_end_to_end_with_sample_data(self):
        """Full pipeline should process sample data without errors."""
        kb = KnowledgeBase()
        kb.documents = [
            Document(
                content="To reset your password, go to Settings then Security. "
                        "You need email verification and the new password must be "
                        "at least 12 characters.",
                metadata={"id": "article-001"},
                embedding=[0.8, 0.1, 0.1]
            ),
            Document(
                content="Error E-4012 means expired API key. "
                        "Error E-4013 means rate limit exceeded.",
                metadata={"id": "article-002"},
                embedding=[0.1, 0.8, 0.1]
            ),
        ]
        pipeline = RAGPipeline(kb)
        pipeline.build_index()
        answer = pipeline.generate_answer("password reset", [0.8, 0.1, 0.1])
        assert "context" in answer.lower() or "password" in answer.lower()
