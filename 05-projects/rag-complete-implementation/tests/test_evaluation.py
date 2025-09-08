"""
Tests and evaluation metrics for RAG system performance.
"""
import pytest
import asyncio
import json
import time
from typing import List, Dict, Any
from dataclasses import dataclass
import statistics

from rag_system.rag_engine import RAGEngine, RAGResponse


@dataclass
class EvaluationResult:
    """Results from RAG system evaluation."""
    
    query: str
    expected_answer: str
    actual_answer: str
    sources: List[Dict[str, Any]]
    response_time: float
    relevance_score: float
    accuracy_score: float
    citation_score: float
    token_usage: Dict[str, int]


class RAGEvaluator:
    """Evaluator for RAG system performance."""
    
    def __init__(self, rag_engine: RAGEngine):
        """Initialize the evaluator."""
        self.rag_engine = rag_engine
    
    async def evaluate_query(
        self,
        query: str,
        expected_answer: str,
        relevant_documents: List[str] = None
    ) -> EvaluationResult:
        """
        Evaluate a single query against expected results.
        
        Args:
            query: The query to evaluate
            expected_answer: Expected answer for comparison
            relevant_documents: List of document IDs that should be retrieved
            
        Returns:
            EvaluationResult with metrics
        """
        start_time = time.time()
        response = await self.rag_engine.query(query)
        end_time = time.time()
        
        # Calculate relevance score (based on source quality)
        relevance_score = self._calculate_relevance_score(response.sources, relevant_documents)
        
        # Calculate accuracy score (semantic similarity between answers)
        accuracy_score = self._calculate_accuracy_score(response.answer, expected_answer)
        
        # Calculate citation score (quality of source attribution)
        citation_score = self._calculate_citation_score(response.answer, response.sources)
        
        return EvaluationResult(
            query=query,
            expected_answer=expected_answer,
            actual_answer=response.answer,
            sources=response.sources,
            response_time=end_time - start_time,
            relevance_score=relevance_score,
            accuracy_score=accuracy_score,
            citation_score=citation_score,
            token_usage=response.token_usage
        )
    
    def _calculate_relevance_score(
        self,
        retrieved_sources: List[Dict[str, Any]],
        relevant_documents: List[str] = None
    ) -> float:
        """
        Calculate relevance score based on retrieved sources.
        
        Args:
            retrieved_sources: Sources retrieved by the RAG system
            relevant_documents: Known relevant document IDs
            
        Returns:
            Relevance score between 0 and 1
        """
        if not retrieved_sources:
            return 0.0
        
        # If we have ground truth relevant documents, calculate precision
        if relevant_documents:
            retrieved_docs = set(source["document_id"] for source in retrieved_sources)
            relevant_set = set(relevant_documents)
            
            if len(retrieved_docs) == 0:
                return 0.0
            
            # Calculate precision (relevant retrieved / total retrieved)
            precision = len(retrieved_docs & relevant_set) / len(retrieved_docs)
            return precision
        else:
            # Fallback: use average similarity scores
            similarity_scores = [
                source.get("similarity_score", source.get("similarity", 0))
                for source in retrieved_sources
            ]
            return statistics.mean(similarity_scores) if similarity_scores else 0.0
    
    def _calculate_accuracy_score(self, actual_answer: str, expected_answer: str) -> float:
        """
        Calculate accuracy score using simple text similarity metrics.
        
        Args:
            actual_answer: Generated answer
            expected_answer: Expected answer
            
        Returns:
            Accuracy score between 0 and 1
        """
        # Simple word overlap-based similarity
        actual_words = set(actual_answer.lower().split())
        expected_words = set(expected_answer.lower().split())
        
        if len(expected_words) == 0:
            return 1.0 if len(actual_words) == 0 else 0.0
        
        # Calculate Jaccard similarity
        intersection = actual_words & expected_words
        union = actual_words | expected_words
        
        jaccard_score = len(intersection) / len(union) if len(union) > 0 else 0.0
        
        # Also check if key concepts are present
        concept_score = len(intersection) / len(expected_words)
        
        # Combine scores
        return (jaccard_score + concept_score) / 2
    
    def _calculate_citation_score(
        self,
        answer: str,
        sources: List[Dict[str, Any]]
    ) -> float:
        """
        Calculate citation score based on source attribution in the answer.
        
        Args:
            answer: Generated answer
            sources: Retrieved sources
            
        Returns:
            Citation score between 0 and 1
        """
        if not sources:
            return 0.0
        
        # Check for citation patterns like [Source 1], [1], etc.
        citation_patterns = ["[Source", "[source", "[1]", "[2]", "[3]", "[4]", "[5]"]
        citations_found = sum(1 for pattern in citation_patterns if pattern in answer)
        
        # Score based on presence of citations relative to number of sources
        max_possible_citations = min(len(sources), 5)  # Usually top 5 sources
        citation_ratio = min(citations_found / max_possible_citations, 1.0) if max_possible_citations > 0 else 0.0
        
        return citation_ratio
    
    async def evaluate_dataset(
        self,
        test_cases: List[Dict[str, Any]]
    ) -> List[EvaluationResult]:
        """
        Evaluate the RAG system on a dataset of test cases.
        
        Args:
            test_cases: List of test cases with query, expected_answer, relevant_docs
            
        Returns:
            List of evaluation results
        """
        results = []
        
        for test_case in test_cases:
            try:
                result = await self.evaluate_query(
                    query=test_case["query"],
                    expected_answer=test_case.get("expected_answer", ""),
                    relevant_documents=test_case.get("relevant_documents", [])
                )
                results.append(result)
            except Exception as e:
                print(f"Error evaluating query '{test_case['query']}': {str(e)}")
                continue
        
        return results
    
    def calculate_aggregate_metrics(
        self,
        evaluation_results: List[EvaluationResult]
    ) -> Dict[str, float]:
        """
        Calculate aggregate metrics across all evaluation results.
        
        Args:
            evaluation_results: List of evaluation results
            
        Returns:
            Dictionary of aggregate metrics
        """
        if not evaluation_results:
            return {}
        
        # Extract individual metrics
        relevance_scores = [r.relevance_score for r in evaluation_results]
        accuracy_scores = [r.accuracy_score for r in evaluation_results]
        citation_scores = [r.citation_score for r in evaluation_results]
        response_times = [r.response_time for r in evaluation_results]
        token_counts = [r.token_usage.get("total_tokens", 0) for r in evaluation_results]
        
        return {
            "avg_relevance_score": statistics.mean(relevance_scores),
            "avg_accuracy_score": statistics.mean(accuracy_scores),
            "avg_citation_score": statistics.mean(citation_scores),
            "avg_response_time": statistics.mean(response_times),
            "median_response_time": statistics.median(response_times),
            "p95_response_time": statistics.quantiles(response_times, n=20)[18] if len(response_times) >= 20 else max(response_times),
            "avg_tokens_per_query": statistics.mean(token_counts),
            "total_queries": len(evaluation_results),
            "success_rate": len([r for r in evaluation_results if r.actual_answer and "error" not in r.actual_answer.lower()]) / len(evaluation_results)
        }


class TestRAGEvaluation:
    """Test cases for RAG system evaluation."""
    
    @pytest.fixture
    def sample_test_cases(self):
        """Sample test cases for evaluation."""
        return [
            {
                "query": "What is artificial intelligence?",
                "expected_answer": "Artificial intelligence is intelligence demonstrated by machines",
                "relevant_documents": ["ai_doc_1", "ai_doc_2"]
            },
            {
                "query": "How does machine learning work?",
                "expected_answer": "Machine learning uses data and algorithms to imitate human learning",
                "relevant_documents": ["ml_doc_1"]
            },
            {
                "query": "What are the applications of NLP?",
                "expected_answer": "Natural language processing is used for text analysis and language understanding",
                "relevant_documents": ["nlp_doc_1", "nlp_doc_2"]
            }
        ]
    
    @pytest.mark.asyncio
    async def test_evaluator_initialization(self, mock_vector_store, mock_embedding_service):
        """Test RAG evaluator initialization."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        assert evaluator.rag_engine is not None
    
    @pytest.mark.asyncio
    async def test_single_query_evaluation(self, mock_vector_store, mock_embedding_service):
        """Test evaluation of a single query."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        # Mock the engine's query method
        mock_response = RAGResponse(
            answer="AI is intelligence demonstrated by machines",
            sources=[
                {"document_id": "ai_doc_1", "similarity_score": 0.9, "content": "AI content"}
            ],
            query="What is AI?",
            response_time=1.5,
            token_usage={"total_tokens": 100}
        )
        
        with pytest.mock.patch.object(engine, 'query', return_value=mock_response):
            result = await evaluator.evaluate_query(
                query="What is AI?",
                expected_answer="Artificial intelligence is machine intelligence",
                relevant_documents=["ai_doc_1"]
            )
            
            assert isinstance(result, EvaluationResult)
            assert result.query == "What is AI?"
            assert result.relevance_score > 0
            assert result.accuracy_score >= 0
            assert result.citation_score >= 0
            assert result.response_time > 0
    
    def test_relevance_score_calculation(self, mock_vector_store, mock_embedding_service):
        """Test relevance score calculation."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        # Test with known relevant documents
        sources = [
            {"document_id": "doc1", "similarity_score": 0.9},
            {"document_id": "doc2", "similarity_score": 0.8},
            {"document_id": "doc3", "similarity_score": 0.7}
        ]
        relevant_docs = ["doc1", "doc2"]
        
        score = evaluator._calculate_relevance_score(sources, relevant_docs)
        
        # Should be 2/3 = 0.67 (2 relevant out of 3 retrieved)
        assert 0.6 <= score <= 0.7
    
    def test_relevance_score_fallback(self, mock_vector_store, mock_embedding_service):
        """Test relevance score with similarity fallback."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        sources = [
            {"document_id": "doc1", "similarity_score": 0.9},
            {"document_id": "doc2", "similarity_score": 0.7}
        ]
        
        score = evaluator._calculate_relevance_score(sources, None)
        
        # Should be average of similarity scores: (0.9 + 0.7) / 2 = 0.8
        assert score == 0.8
    
    def test_accuracy_score_calculation(self, mock_vector_store, mock_embedding_service):
        """Test accuracy score calculation."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        actual = "Machine learning is a subset of artificial intelligence"
        expected = "Machine learning is part of artificial intelligence"
        
        score = evaluator._calculate_accuracy_score(actual, expected)
        
        # Should have good overlap of key terms
        assert score > 0.5
    
    def test_citation_score_calculation(self, mock_vector_store, mock_embedding_service):
        """Test citation score calculation."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        answer = "According to [Source 1], machine learning is important. [Source 2] also mentions this."
        sources = [
            {"document_id": "doc1", "content": "Content 1"},
            {"document_id": "doc2", "content": "Content 2"},
            {"document_id": "doc3", "content": "Content 3"}
        ]
        
        score = evaluator._calculate_citation_score(answer, sources)
        
        # Should find 2 citations for 3 sources
        assert score > 0.5
    
    @pytest.mark.asyncio
    async def test_dataset_evaluation(self, mock_vector_store, mock_embedding_service, sample_test_cases):
        """Test evaluation on a dataset."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        # Mock the engine's query method to return consistent responses
        async def mock_query(query):
            return RAGResponse(
                answer=f"Mock answer for: {query}",
                sources=[{"document_id": "doc1", "similarity_score": 0.8, "content": "Mock content"}],
                query=query,
                response_time=1.0,
                token_usage={"total_tokens": 50}
            )
        
        with pytest.mock.patch.object(engine, 'query', side_effect=mock_query):
            results = await evaluator.evaluate_dataset(sample_test_cases)
            
            assert len(results) == len(sample_test_cases)
            for result in results:
                assert isinstance(result, EvaluationResult)
                assert result.actual_answer.startswith("Mock answer for:")
    
    def test_aggregate_metrics_calculation(self, mock_vector_store, mock_embedding_service):
        """Test calculation of aggregate metrics."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        # Create mock evaluation results
        results = [
            EvaluationResult(
                query="Query 1",
                expected_answer="Expected 1",
                actual_answer="Actual 1",
                sources=[],
                response_time=1.0,
                relevance_score=0.8,
                accuracy_score=0.7,
                citation_score=0.9,
                token_usage={"total_tokens": 100}
            ),
            EvaluationResult(
                query="Query 2",
                expected_answer="Expected 2", 
                actual_answer="Actual 2",
                sources=[],
                response_time=1.5,
                relevance_score=0.9,
                accuracy_score=0.8,
                citation_score=0.7,
                token_usage={"total_tokens": 150}
            )
        ]
        
        metrics = evaluator.calculate_aggregate_metrics(results)
        
        assert "avg_relevance_score" in metrics
        assert "avg_accuracy_score" in metrics
        assert "avg_citation_score" in metrics
        assert "avg_response_time" in metrics
        assert "total_queries" in metrics
        assert "success_rate" in metrics
        
        assert metrics["avg_relevance_score"] == 0.85
        assert metrics["avg_accuracy_score"] == 0.75
        assert metrics["avg_response_time"] == 1.25
        assert metrics["total_queries"] == 2
        assert metrics["success_rate"] == 1.0  # Both queries succeeded
    
    def test_empty_evaluation_results(self, mock_vector_store, mock_embedding_service):
        """Test aggregate metrics with empty results."""
        engine = RAGEngine(
            vector_store=mock_vector_store,
            embedding_service=mock_embedding_service
        )
        evaluator = RAGEvaluator(engine)
        
        metrics = evaluator.calculate_aggregate_metrics([])
        
        assert metrics == {}


@pytest.mark.asyncio
async def test_performance_benchmark(mock_vector_store, mock_embedding_service):
    """Benchmark RAG system performance."""
    engine = RAGEngine(
        vector_store=mock_vector_store,
        embedding_service=mock_embedding_service
    )
    
    # Create a simple performance test
    queries = [
        "What is machine learning?",
        "How does AI work?",
        "What are neural networks?",
        "Explain deep learning",
        "What is natural language processing?"
    ]
    
    # Mock response for consistent timing
    mock_response = RAGResponse(
        answer="Mock answer",
        sources=[{"document_id": "doc1", "similarity_score": 0.8, "content": "Mock"}],
        query="Mock query",
        response_time=0.5,
        token_usage={"total_tokens": 75}
    )
    
    with pytest.mock.patch.object(engine, 'query', return_value=mock_response):
        start_time = time.time()
        
        # Execute queries
        responses = []
        for query in queries:
            response = await engine.query(query)
            responses.append(response)
        
        total_time = time.time() - start_time
        
        # Performance assertions
        assert len(responses) == len(queries)
        assert total_time < 10.0  # Should complete in reasonable time
        
        # Calculate throughput
        throughput = len(queries) / total_time
        assert throughput > 0.5  # At least 0.5 queries per second