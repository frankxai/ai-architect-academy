"""
Observability and monitoring integration with Langfuse.
"""
import asyncio
import functools
import time
import uuid
from typing import Dict, Any, Optional, List, Callable
import logging
from datetime import datetime, timedelta

# Langfuse integration
try:
    from langfuse import Langfuse
    from langfuse.decorators import langfuse_context, observe
    LANGFUSE_AVAILABLE = True
except ImportError:
    LANGFUSE_AVAILABLE = False

from config.settings import settings


logger = logging.getLogger(__name__)


class ObservabilityManager:
    """Manager for observability and monitoring with Langfuse integration."""
    
    def __init__(
        self,
        public_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        host: Optional[str] = None,
        enabled: Optional[bool] = None
    ):
        """
        Initialize observability manager.
        
        Args:
            public_key: Langfuse public key
            secret_key: Langfuse secret key
            host: Langfuse host URL
            enabled: Whether observability is enabled
        """
        self.enabled = enabled if enabled is not None else settings.langfuse.enabled
        
        if self.enabled and LANGFUSE_AVAILABLE:
            try:
                self.langfuse = Langfuse(
                    public_key=public_key or settings.langfuse.public_key,
                    secret_key=secret_key or settings.langfuse.secret_key,
                    host=host or settings.langfuse.host
                )
                logger.info("Langfuse observability initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Langfuse: {str(e)}")
                self.enabled = False
                self.langfuse = None
        else:
            self.langfuse = None
            if not LANGFUSE_AVAILABLE:
                logger.warning("Langfuse not available - observability disabled")
    
    def create_trace(
        self,
        name: str,
        metadata: Optional[Dict[str, Any]] = None,
        tags: Optional[List[str]] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Optional[str]:
        """
        Create a new trace for tracking operations.
        
        Args:
            name: Name of the trace
            metadata: Additional metadata
            tags: List of tags
            user_id: User identifier
            session_id: Session identifier
            
        Returns:
            Trace ID if successful, None otherwise
        """
        if not self.enabled or not self.langfuse:
            return None
        
        try:
            trace = self.langfuse.trace(
                name=name,
                metadata=metadata or {},
                tags=tags or [],
                user_id=user_id,
                session_id=session_id
            )
            return trace.id
        except Exception as e:
            logger.error(f"Failed to create trace: {str(e)}")
            return None
    
    def create_span(
        self,
        trace_id: Optional[str],
        name: str,
        span_type: str = "span",
        metadata: Optional[Dict[str, Any]] = None,
        input_data: Optional[Dict[str, Any]] = None,
        output_data: Optional[Dict[str, Any]] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        level: str = "DEFAULT"
    ) -> Optional[str]:
        """
        Create a span within a trace.
        
        Args:
            trace_id: Parent trace ID
            name: Span name
            span_type: Type of span (span, generation, etc.)
            metadata: Additional metadata
            input_data: Input data for the span
            output_data: Output data for the span
            start_time: Start time
            end_time: End time
            level: Log level
            
        Returns:
            Span ID if successful, None otherwise
        """
        if not self.enabled or not self.langfuse or not trace_id:
            return None
        
        try:
            span = self.langfuse.span(
                trace_id=trace_id,
                name=name,
                metadata=metadata or {},
                input=input_data,
                output=output_data,
                start_time=start_time,
                end_time=end_time,
                level=level
            )
            return span.id
        except Exception as e:
            logger.error(f"Failed to create span: {str(e)}")
            return None
    
    def log_generation(
        self,
        trace_id: Optional[str],
        name: str,
        model: str,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any],
        usage: Optional[Dict[str, int]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Optional[str]:
        """
        Log a generation (LLM call) event.
        
        Args:
            trace_id: Parent trace ID
            name: Generation name
            model: Model name used
            input_data: Input to the model
            output_data: Output from the model
            usage: Token usage information
            metadata: Additional metadata
            start_time: Start time
            end_time: End time
            
        Returns:
            Generation ID if successful, None otherwise
        """
        if not self.enabled or not self.langfuse or not trace_id:
            return None
        
        try:
            generation = self.langfuse.generation(
                trace_id=trace_id,
                name=name,
                model=model,
                input=input_data,
                output=output_data,
                usage=usage,
                metadata=metadata or {},
                start_time=start_time,
                end_time=end_time
            )
            return generation.id
        except Exception as e:
            logger.error(f"Failed to log generation: {str(e)}")
            return None
    
    def log_retrieval(
        self,
        trace_id: Optional[str],
        name: str,
        query: str,
        results: List[Dict[str, Any]],
        metadata: Optional[Dict[str, Any]] = None
    ) -> Optional[str]:
        """
        Log a retrieval operation.
        
        Args:
            trace_id: Parent trace ID
            name: Retrieval operation name
            query: Search query
            results: Retrieved results
            metadata: Additional metadata
            
        Returns:
            Event ID if successful, None otherwise
        """
        if not self.enabled or not self.langfuse or not trace_id:
            return None
        
        try:
            event = self.langfuse.event(
                trace_id=trace_id,
                name=name,
                input={"query": query},
                output={
                    "results_count": len(results),
                    "results": results[:5]  # Log only first 5 results to avoid large payloads
                },
                metadata={
                    **(metadata or {}),
                    "operation_type": "retrieval",
                    "total_results": len(results)
                }
            )
            return event.id
        except Exception as e:
            logger.error(f"Failed to log retrieval: {str(e)}")
            return None
    
    def update_span(
        self,
        span_id: str,
        output_data: Optional[Dict[str, Any]] = None,
        end_time: Optional[datetime] = None,
        metadata: Optional[Dict[str, Any]] = None,
        level: Optional[str] = None
    ):
        """
        Update an existing span with additional information.
        
        Args:
            span_id: Span ID to update
            output_data: Output data
            end_time: End time
            metadata: Additional metadata
            level: Log level
        """
        if not self.enabled or not self.langfuse:
            return
        
        try:
            self.langfuse.span(
                id=span_id,
                output=output_data,
                end_time=end_time,
                metadata=metadata,
                level=level
            )
        except Exception as e:
            logger.error(f"Failed to update span: {str(e)}")
    
    def log_score(
        self,
        trace_id: Optional[str],
        name: str,
        value: float,
        comment: Optional[str] = None
    ):
        """
        Log a score for a trace.
        
        Args:
            trace_id: Trace ID
            name: Score name
            value: Score value
            comment: Optional comment
        """
        if not self.enabled or not self.langfuse or not trace_id:
            return
        
        try:
            self.langfuse.score(
                trace_id=trace_id,
                name=name,
                value=value,
                comment=comment
            )
        except Exception as e:
            logger.error(f"Failed to log score: {str(e)}")
    
    def flush(self):
        """Flush all pending events to Langfuse."""
        if self.enabled and self.langfuse:
            try:
                self.langfuse.flush()
            except Exception as e:
                logger.error(f"Failed to flush events: {str(e)}")


# Global observability manager instance
observability = ObservabilityManager()


def trace_operation(
    name: str,
    trace_metadata: Optional[Dict[str, Any]] = None,
    span_metadata: Optional[Dict[str, Any]] = None,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None
):
    """
    Decorator for tracing operations with Langfuse.
    
    Args:
        name: Operation name
        trace_metadata: Metadata for the trace
        span_metadata: Metadata for the span
        user_id: User identifier
        session_id: Session identifier
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            if not observability.enabled:
                return await func(*args, **kwargs)
            
            start_time = datetime.now()
            trace_id = observability.create_trace(
                name=f"{name}_trace",
                metadata=trace_metadata,
                user_id=user_id,
                session_id=session_id
            )
            
            span_id = observability.create_span(
                trace_id=trace_id,
                name=name,
                metadata=span_metadata,
                start_time=start_time
            )
            
            try:
                # Execute the function
                result = await func(*args, **kwargs)
                
                # Update span with successful result
                end_time = datetime.now()
                observability.update_span(
                    span_id=span_id,
                    end_time=end_time,
                    level="DEFAULT"
                )
                
                return result
                
            except Exception as e:
                # Update span with error information
                end_time = datetime.now()
                observability.update_span(
                    span_id=span_id,
                    end_time=end_time,
                    metadata={"error": str(e)},
                    level="ERROR"
                )
                raise
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            if not observability.enabled:
                return func(*args, **kwargs)
            
            start_time = datetime.now()
            trace_id = observability.create_trace(
                name=f"{name}_trace",
                metadata=trace_metadata,
                user_id=user_id,
                session_id=session_id
            )
            
            span_id = observability.create_span(
                trace_id=trace_id,
                name=name,
                metadata=span_metadata,
                start_time=start_time
            )
            
            try:
                # Execute the function
                result = func(*args, **kwargs)
                
                # Update span with successful result
                end_time = datetime.now()
                observability.update_span(
                    span_id=span_id,
                    end_time=end_time,
                    level="DEFAULT"
                )
                
                return result
                
            except Exception as e:
                # Update span with error information
                end_time = datetime.now()
                observability.update_span(
                    span_id=span_id,
                    end_time=end_time,
                    metadata={"error": str(e)},
                    level="ERROR"
                )
                raise
        
        # Return appropriate wrapper based on function type
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator


class RAGObservability:
    """Specialized observability for RAG operations."""
    
    def __init__(self, manager: Optional[ObservabilityManager] = None):
        """Initialize RAG observability."""
        self.manager = manager or observability
    
    async def trace_ingestion(
        self,
        file_paths: List[str],
        document_count: int,
        chunk_count: int,
        processing_time: float,
        user_id: Optional[str] = None
    ) -> Optional[str]:
        """
        Trace document ingestion operation.
        
        Args:
            file_paths: List of ingested file paths
            document_count: Number of documents processed
            chunk_count: Number of chunks created
            processing_time: Processing time in seconds
            user_id: User identifier
            
        Returns:
            Trace ID if successful
        """
        trace_id = self.manager.create_trace(
            name="document_ingestion",
            metadata={
                "operation_type": "ingestion",
                "file_count": len(file_paths),
                "document_count": document_count,
                "chunk_count": chunk_count,
                "processing_time": processing_time,
                "files": file_paths[:10]  # Log first 10 files only
            },
            tags=["ingestion", "documents"],
            user_id=user_id
        )
        
        return trace_id
    
    async def trace_query(
        self,
        query: str,
        response: str,
        sources: List[Dict[str, Any]],
        response_time: float,
        token_usage: Dict[str, int],
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Optional[str]:
        """
        Trace a RAG query operation.
        
        Args:
            query: User query
            response: Generated response
            sources: Retrieved sources
            response_time: Response time in seconds
            token_usage: Token usage information
            user_id: User identifier
            session_id: Session identifier
            
        Returns:
            Trace ID if successful
        """
        start_time = datetime.now() - timedelta(seconds=response_time)
        end_time = datetime.now()
        
        trace_id = self.manager.create_trace(
            name="rag_query",
            metadata={
                "operation_type": "query",
                "response_time": response_time,
                "sources_count": len(sources),
                "total_tokens": token_usage.get("total_tokens", 0)
            },
            tags=["rag", "query"],
            user_id=user_id,
            session_id=session_id
        )
        
        # Log retrieval
        self.manager.log_retrieval(
            trace_id=trace_id,
            name="document_retrieval",
            query=query,
            results=sources,
            metadata={
                "retrieval_time": response_time * 0.3,  # Estimate
                "similarity_scores": [s.get("similarity_score", 0) for s in sources]
            }
        )
        
        # Log generation
        self.manager.log_generation(
            trace_id=trace_id,
            name="response_generation",
            model=settings.openai.chat_model,
            input_data={"query": query, "context_length": len(" ".join(s.get("content", "") for s in sources))},
            output_data={"response": response},
            usage=token_usage,
            metadata={
                "generation_time": response_time * 0.7,  # Estimate
                "temperature": settings.openai.temperature
            },
            start_time=start_time,
            end_time=end_time
        )
        
        return trace_id
    
    def log_user_feedback(
        self,
        trace_id: Optional[str],
        rating: float,
        feedback: Optional[str] = None
    ):
        """
        Log user feedback for a query.
        
        Args:
            trace_id: Trace ID
            rating: User rating (0-1)
            feedback: Optional feedback text
        """
        self.manager.log_score(
            trace_id=trace_id,
            name="user_rating",
            value=rating,
            comment=feedback
        )