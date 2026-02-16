"""
RAG Pipeline for Customer Support Knowledge Base

Production incident report: Customer satisfaction dropped from 92% to 41%
after deploying this pipeline. Support tickets say answers are "irrelevant",
"incomplete", or "missing entirely." Engineering hasn't found the root cause.

Your job: Diagnose why retrieval quality tanked and fix it.
Run the tests in tests/ — they represent the quality bar we need to hit.
"""
import json
from dataclasses import dataclass
from typing import Optional


@dataclass
class Document:
    content: str
    metadata: dict
    embedding: Optional[list[float]] = None


@dataclass
class SearchResult:
    document: Document
    score: float


class KnowledgeBase:
    def __init__(self):
        self.documents: list[Document] = []

    def load_documents(self, filepath: str) -> None:
        """Load documents from a JSON file."""
        with open(filepath, "r") as f:
            data = json.load(f)
        for item in data:
            doc = Document(content=item["content"], metadata=item.get("metadata", {}))
            self.documents.append(doc)

    def chunk_documents(self, chunk_size: int = 10000, overlap: int = 0) -> list[Document]:
        """Split documents into chunks for better retrieval."""
        chunks = []
        for doc in self.documents:
            if len(doc.content) <= chunk_size:
                chunks.append(doc)
            else:
                chunks.append(Document(
                    content=doc.content[:chunk_size],
                    metadata=doc.metadata
                ))
        return chunks


class Retriever:
    def __init__(self, documents: list[Document]):
        self.documents = documents

    def _cosine_similarity(self, a: list[float], b: list[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(x * x for x in b) ** 0.5
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def search(self, query_embedding: list[float], top_k: int = 3) -> list[SearchResult]:
        """Search for relevant documents."""
        results = []
        for doc in self.documents:
            if doc.embedding is None:
                continue
            score = self._cosine_similarity(query_embedding, doc.embedding)
            results.append(SearchResult(document=doc, score=score))

        results.sort(key=lambda x: x.score, reverse=True)
        return results[:top_k]


class RAGPipeline:
    def __init__(self, knowledge_base: KnowledgeBase):
        self.kb = knowledge_base
        self.retriever: Optional[Retriever] = None

    def build_index(self) -> None:
        """Build the search index from the knowledge base."""
        chunks = self.kb.chunk_documents()
        # In production, embeddings would be generated here
        self.retriever = Retriever(chunks)

    def generate_answer(self, query: str, query_embedding: list[float]) -> str:
        """Retrieve context and generate an answer."""
        if self.retriever is None:
            raise RuntimeError("Index not built. Call build_index() first.")

        results = self.retriever.search(query_embedding, top_k=3)

        max_context_length = 500
        context_parts = []
        total_length = 0
        for result in results:
            remaining = max_context_length - total_length
            if remaining <= 0:
                break
            context_parts.append(result.document.content[:remaining])
            total_length += len(result.document.content[:remaining])

        context = "\n---\n".join(context_parts)

        # In production, this would call an LLM
        return f"Based on the following context:\n{context}\n\nAnswer: [LLM would generate here]"


# Entry point for testing
if __name__ == "__main__":
    kb = KnowledgeBase()
    kb.load_documents("data/support_articles.json")

    pipeline = RAGPipeline(kb)
    pipeline.build_index()

    # Test query
    test_embedding = [0.1] * 384  # Placeholder
    answer = pipeline.generate_answer("How do I reset my password?", test_embedding)
    print(answer)
