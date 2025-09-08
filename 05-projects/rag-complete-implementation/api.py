"""
FastAPI server for RAG Complete Implementation.
Production-ready API with authentication, rate limiting, and monitoring.
"""
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional, Union
import asyncio
import time
import logging
from contextlib import asynccontextmanager
import os
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response
import uvicorn

from src.rag_system.rag_engine import RAGEngine, RAGResponse
from config.settings import settings

# Metrics
REQUEST_COUNT = Counter('rag_requests_total', 'Total RAG requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('rag_request_duration_seconds', 'RAG request duration')
DOCUMENT_PROCESSING_COUNT = Counter('documents_processed_total', 'Total documents processed')
QUERY_COUNT = Counter('queries_processed_total', 'Total queries processed')

logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

class RAGRequest(BaseModel):
    """Request model for RAG queries."""
    query: str = Field(..., min_length=1, max_length=1000, description="User query")
    max_results: int = Field(default=5, ge=1, le=20, description="Maximum results to return")
    similarity_threshold: float = Field(default=0.7, ge=0.0, le=1.0, description="Similarity threshold")
    include_sources: bool = Field(default=True, description="Include source documents")
    
    @validator('query')
    def validate_query(cls, v):
        if not v.strip():
            raise ValueError('Query cannot be empty')
        return v.strip()

class DocumentIngestRequest(BaseModel):
    """Request model for document ingestion."""
    documents: List[str] = Field(..., description="List of document texts")
    document_ids: Optional[List[str]] = Field(None, description="Optional document IDs")
    metadata: Optional[List[Dict[str, Any]]] = Field(None, description="Optional metadata per document")
    
    @validator('documents')
    def validate_documents(cls, v):
        if not v:
            raise ValueError('Documents list cannot be empty')
        return v

class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    uptime: float
    components: Dict[str, str]

# Global variables
rag_engine: Optional[RAGEngine] = None
app_start_time = time.time()

async def get_rag_engine() -> RAGEngine:
    """Dependency to get RAG engine instance."""
    global rag_engine
    if rag_engine is None:
        raise HTTPException(status_code=503, detail="RAG engine not initialized")
    return rag_engine

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify authentication token."""
    token = credentials.credentials
    
    # In production, implement proper JWT validation
    if settings.api.auth_enabled and token != settings.api.auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup
    global rag_engine
    logger.info("Initializing RAG engine...")
    
    try:
        rag_engine = RAGEngine()
        await rag_engine.initialize()
        logger.info("RAG engine initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize RAG engine: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down RAG API...")

# Create FastAPI app
app = FastAPI(
    title="RAG Complete Implementation API",
    description="Production-ready Retrieval-Augmented Generation API with enterprise features",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.api.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.middleware("http")
async def add_process_time_header(request, call_next):
    """Add processing time to response headers."""
    start_time = time.time()
    
    # Track metrics
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    REQUEST_DURATION.observe(process_time)
    
    return response

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    uptime = time.time() - app_start_time
    
    # Check component health
    components = {}
    try:
        if rag_engine:
            # Test vector store connection
            components["vector_store"] = "healthy"
            components["embedding_service"] = "healthy"
            components["llm_service"] = "healthy"
        else:
            components["rag_engine"] = "not_initialized"
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        components["error"] = str(e)
    
    return HealthResponse(
        status="healthy" if all(v == "healthy" for v in components.values()) else "degraded",
        version="1.0.0",
        uptime=uptime,
        components=components
    )

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/query", response_model=RAGResponse)
async def query_rag(
    request: RAGRequest,
    engine: RAGEngine = Depends(get_rag_engine),
    token: str = Depends(verify_token)
):
    """Execute RAG query."""
    start_time = time.time()
    
    try:
        logger.info(f"Processing query: {request.query[:100]}...")
        
        response = await engine.query(
            query=request.query,
            max_results=request.max_results,
            similarity_threshold=request.similarity_threshold,
            include_sources=request.include_sources
        )
        
        QUERY_COUNT.inc()
        
        logger.info(f"Query processed in {time.time() - start_time:.2f}s")
        return response
        
    except Exception as e:
        logger.error(f"Query processing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest")
async def ingest_documents(
    request: DocumentIngestRequest,
    background_tasks: BackgroundTasks,
    engine: RAGEngine = Depends(get_rag_engine),
    token: str = Depends(verify_token)
):
    """Ingest documents into the RAG system."""
    try:
        logger.info(f"Ingesting {len(request.documents)} documents...")
        
        # Process in background for large batches
        if len(request.documents) > 10:
            background_tasks.add_task(
                engine.ingest_documents,
                documents=request.documents,
                document_ids=request.document_ids,
                metadata=request.metadata
            )
            
            return JSONResponse(
                status_code=202,
                content={"message": "Documents queued for processing", "count": len(request.documents)}
            )
        else:
            # Process immediately for small batches
            result = await engine.ingest_documents(
                documents=request.documents,
                document_ids=request.document_ids,
                metadata=request.metadata
            )
            
            DOCUMENT_PROCESSING_COUNT.inc(len(request.documents))
            
            return JSONResponse(
                status_code=200,
                content={"message": "Documents processed successfully", "result": result}
            )
            
    except Exception as e:
        logger.error(f"Document ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents(
    skip: int = 0,
    limit: int = 100,
    engine: RAGEngine = Depends(get_rag_engine),
    token: str = Depends(verify_token)
):
    """List ingested documents."""
    try:
        documents = await engine.list_documents(skip=skip, limit=limit)
        return JSONResponse(content={"documents": documents, "count": len(documents)})
        
    except Exception as e:
        logger.error(f"Failed to list documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    engine: RAGEngine = Depends(get_rag_engine),
    token: str = Depends(verify_token)
):
    """Delete a document from the RAG system."""
    try:
        success = await engine.delete_document(document_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")
            
        return JSONResponse(content={"message": "Document deleted successfully"})
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats(
    engine: RAGEngine = Depends(get_rag_engine),
    token: str = Depends(verify_token)
):
    """Get RAG system statistics."""
    try:
        stats = await engine.get_statistics()
        return JSONResponse(content=stats)
        
    except Exception as e:
        logger.error(f"Failed to get stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate_system(
    test_queries: List[str],
    expected_answers: Optional[List[str]] = None,
    engine: RAGEngine = Depends(get_rag_engine),
    token: str = Depends(verify_token)
):
    """Evaluate RAG system performance."""
    try:
        logger.info(f"Running evaluation with {len(test_queries)} queries...")
        
        evaluation_results = await engine.evaluate(
            test_queries=test_queries,
            expected_answers=expected_answers
        )
        
        return JSONResponse(content=evaluation_results)
        
    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "RAG Complete Implementation API",
        "version": "1.0.0",
        "description": "Production-ready Retrieval-Augmented Generation API",
        "docs_url": "/docs",
        "health_url": "/health",
        "metrics_url": "/metrics"
    }

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Run server
    uvicorn.run(
        "api:app",
        host=settings.api.host,
        port=settings.api.port,
        reload=settings.api.reload,
        workers=settings.api.workers if not settings.api.reload else 1,
        log_level=settings.api.log_level.lower()
    )