"""
Streamlit web application for the RAG system.
"""
import asyncio
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import time
import os
import sys
from pathlib import Path
import uuid

# Add src to path
sys.path.append(str(Path(__file__).parent.parent / "src"))

from rag_system.rag_engine import RAGEngine
from rag_system.observability import RAGObservability
from config.settings import settings


# Initialize session state
if 'rag_engine' not in st.session_state:
    st.session_state.rag_engine = None
if 'session_id' not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())
if 'query_history' not in st.session_state:
    st.session_state.query_history = []
if 'user_id' not in st.session_state:
    st.session_state.user_id = "streamlit_user"


async def initialize_rag_engine():
    """Initialize the RAG engine."""
    if st.session_state.rag_engine is None:
        with st.spinner("Initializing RAG engine..."):
            try:
                engine = RAGEngine()
                await engine.initialize()
                st.session_state.rag_engine = engine
                st.success("RAG engine initialized successfully!")
                return True
            except Exception as e:
                st.error(f"Failed to initialize RAG engine: {str(e)}")
                return False
    return True


def main():
    """Main Streamlit application."""
    st.set_page_config(
        page_title="RAG Complete Implementation",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    st.title("🤖 RAG Complete Implementation")
    st.markdown("*Production-ready Retrieval-Augmented Generation system*")
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.radio(
        "Select a page:",
        ["🏠 Home", "📤 Document Upload", "❓ Ask Questions", "📊 Analytics", "⚙️ Settings"]
    )
    
    # Initialize RAG engine
    if not asyncio.run(initialize_rag_engine()):
        st.stop()
    
    # Page routing
    if page == "🏠 Home":
        show_home_page()
    elif page == "📤 Document Upload":
        show_upload_page()
    elif page == "❓ Ask Questions":
        show_query_page()
    elif page == "📊 Analytics":
        show_analytics_page()
    elif page == "⚙️ Settings":
        show_settings_page()


def show_home_page():
    """Display the home page."""
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("Welcome to RAG Complete Implementation")
        
        st.markdown("""
        This is a production-ready Retrieval-Augmented Generation (RAG) system that combines:
        
        - **🗂️ Document Processing**: Support for PDF, DOCX, TXT, MD, HTML files
        - **🔍 Vector Search**: Powered by Supabase + pgvector
        - **🤖 AI Integration**: OpenAI embeddings and GPT models
        - **📝 Smart Chunking**: Advanced text splitting with overlap
        - **📊 Observability**: Comprehensive tracking with Langfuse
        - **🎯 Citation Tracking**: Source attribution for all responses
        
        ### Quick Start:
        1. Upload your documents using the "📤 Document Upload" page
        2. Ask questions using the "❓ Ask Questions" page
        3. Monitor performance in the "📊 Analytics" page
        """)
        
        # System status
        if st.button("🔍 Check System Status"):
            with st.spinner("Checking system status..."):
                try:
                    stats = asyncio.run(st.session_state.rag_engine.get_collection_stats())
                    st.success("✅ System is operational!")
                    
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Total Documents", stats.get("total_documents", 0))
                    with col2:
                        st.metric("Total Chunks", stats.get("total_chunks", 0))
                    with col3:
                        st.metric("Total Tokens", f"{stats.get('total_tokens', 0):,}")
                        
                except Exception as e:
                    st.error(f"❌ System check failed: {str(e)}")
    
    with col2:
        st.header("🔧 System Architecture")
        
        # Architecture diagram using mermaid
        st.markdown("""
        ```mermaid
        graph TD
            A[Documents] --> B[Document Processor]
            B --> C[Text Chunker]
            C --> D[Embedding Service]
            D --> E[Vector Store]
            
            F[User Query] --> G[Query Embedding]
            G --> E
            E --> H[Retrieved Chunks]
            H --> I[LLM Generation]
            I --> J[Response + Citations]
            
            K[Langfuse] --> L[Observability]
            I --> K
            E --> K
        ```
        """)


def show_upload_page():
    """Display the document upload page."""
    st.header("📤 Document Upload")
    
    # Upload method selection
    upload_method = st.radio(
        "Select upload method:",
        ["📁 File Upload", "📂 Directory Path"]
    )
    
    if upload_method == "📁 File Upload":
        uploaded_files = st.file_uploader(
            "Choose files to upload",
            accept_multiple_files=True,
            type=['pdf', 'docx', 'txt', 'md', 'html', 'htm']
        )
        
        if uploaded_files:
            st.write(f"Selected {len(uploaded_files)} files:")
            for file in uploaded_files:
                st.write(f"- {file.name} ({file.size:,} bytes)")
            
            if st.button("🚀 Process Files"):
                process_uploaded_files(uploaded_files)
    
    else:  # Directory path
        directory_path = st.text_input(
            "Enter directory path:",
            placeholder="/path/to/your/documents"
        )
        
        col1, col2 = st.columns(2)
        with col1:
            recursive = st.checkbox("Include subdirectories", value=True)
        with col2:
            max_files = st.number_input("Max files to process", min_value=1, value=100)
        
        if directory_path and st.button("🚀 Process Directory"):
            process_directory(directory_path, recursive, max_files)


def process_uploaded_files(uploaded_files):
    """Process uploaded files."""
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    try:
        # Save uploaded files temporarily
        temp_dir = Path("temp_uploads")
        temp_dir.mkdir(exist_ok=True)
        
        file_paths = []
        for i, uploaded_file in enumerate(uploaded_files):
            file_path = temp_dir / uploaded_file.name
            with open(file_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            file_paths.append(str(file_path))
            
            progress_bar.progress((i + 1) / len(uploaded_files) * 0.5)
            status_text.text(f"Saved {uploaded_file.name}")
        
        # Process documents
        status_text.text("Processing documents...")
        results = asyncio.run(st.session_state.rag_engine.ingest_documents(file_paths))
        
        progress_bar.progress(1.0)
        status_text.text("Processing complete!")
        
        # Display results
        st.success(f"✅ Processing completed!")
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Documents Processed", results["processed_documents"])
        with col2:
            st.metric("Chunks Created", results["total_chunks"])
        with col3:
            st.metric("Processing Time", f"{results['processing_time']:.2f}s")
        
        if results["failed_documents"]:
            st.warning(f"⚠️ {len(results['failed_documents'])} files failed to process:")
            for failed in results["failed_documents"]:
                st.write(f"- {failed['file_path']}: {failed['error']}")
        
        # Cleanup temp files
        for file_path in file_paths:
            os.remove(file_path)
        temp_dir.rmdir()
        
    except Exception as e:
        st.error(f"❌ Processing failed: {str(e)}")


def process_directory(directory_path, recursive, max_files):
    """Process directory of documents."""
    with st.spinner("Processing directory..."):
        try:
            results = asyncio.run(
                st.session_state.rag_engine.ingest_directory(
                    directory_path,
                    recursive=recursive,
                    max_files=max_files
                )
            )
            
            if "error" in results:
                st.error(f"❌ {results['error']}")
                return
            
            st.success("✅ Directory processing completed!")
            
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Documents Processed", results["processed_documents"])
            with col2:
                st.metric("Chunks Created", results["total_chunks"])
            with col3:
                st.metric("Total Tokens", f"{results['document_stats'].get('total_tokens', 0):,}")
                
        except Exception as e:
            st.error(f"❌ Directory processing failed: {str(e)}")


def show_query_page():
    """Display the question answering page."""
    st.header("❓ Ask Questions")
    
    # Query input
    query = st.text_input(
        "Enter your question:",
        placeholder="What would you like to know?",
        key="query_input"
    )
    
    col1, col2, col3 = st.columns([1, 1, 2])
    with col1:
        top_k = st.number_input("Top K Results", min_value=1, max_value=20, value=5)
    with col2:
        use_hybrid = st.checkbox("Use Hybrid Search", value=True)
    with col3:
        similarity_threshold = st.slider(
            "Similarity Threshold", 
            min_value=0.0, 
            max_value=1.0, 
            value=0.7, 
            step=0.1
        )
    
    if st.button("🔍 Ask Question") and query:
        with st.spinner("Searching and generating response..."):
            start_time = time.time()
            
            try:
                response = asyncio.run(
                    st.session_state.rag_engine.query(
                        query,
                        top_k=top_k,
                        similarity_threshold=similarity_threshold,
                        use_hybrid_search=use_hybrid
                    )
                )
                
                end_time = time.time()
                
                # Display response
                st.success("✅ Response generated!")
                st.markdown("### 🤖 Answer:")
                st.markdown(response.answer)
                
                # Display sources
                if response.sources:
                    st.markdown("### 📚 Sources:")
                    for i, source in enumerate(response.sources, 1):
                        with st.expander(f"Source {i} - Similarity: {source['similarity_score']:.3f}"):
                            st.markdown(f"**Document:** {source['document_id']}")
                            st.markdown(f"**Content:** {source['content'][:500]}...")
                            if source['metadata']:
                                st.json(source['metadata'])
                
                # Display metrics
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Response Time", f"{response.response_time:.2f}s")
                with col2:
                    st.metric("Sources Used", len(response.sources))
                with col3:
                    st.metric("Total Tokens", response.token_usage.get("total_tokens", 0))
                with col4:
                    st.metric("Cost (est.)", f"${response.token_usage.get('total_tokens', 0) * 0.000015:.4f}")
                
                # Add to history
                st.session_state.query_history.append({
                    "timestamp": datetime.now(),
                    "query": query,
                    "answer": response.answer,
                    "sources": len(response.sources),
                    "response_time": response.response_time,
                    "tokens": response.token_usage.get("total_tokens", 0)
                })
                
                # User feedback
                st.markdown("### 📝 Rate this response:")
                col1, col2 = st.columns(2)
                with col1:
                    rating = st.slider("Rating", 0, 5, 3, key=f"rating_{len(st.session_state.query_history)}")
                with col2:
                    feedback = st.text_input("Feedback (optional)", key=f"feedback_{len(st.session_state.query_history)}")
                
                if st.button("Submit Feedback"):
                    st.success("Thank you for your feedback!")
                
            except Exception as e:
                st.error(f"❌ Query failed: {str(e)}")
    
    # Query history
    if st.session_state.query_history:
        st.markdown("### 📋 Recent Queries")
        
        history_df = pd.DataFrame(st.session_state.query_history)
        history_df['timestamp'] = pd.to_datetime(history_df['timestamp'])
        
        # Show last 10 queries
        recent_queries = history_df.tail(10).sort_values('timestamp', ascending=False)
        
        for _, row in recent_queries.iterrows():
            with st.expander(f"Q: {row['query'][:100]}... ({row['timestamp'].strftime('%H:%M:%S')})"):
                st.markdown(f"**Answer:** {row['answer'][:200]}...")
                st.markdown(f"**Sources:** {row['sources']} | **Time:** {row['response_time']:.2f}s | **Tokens:** {row['tokens']}")


def show_analytics_page():
    """Display analytics and system metrics."""
    st.header("📊 Analytics & Monitoring")
    
    # System statistics
    try:
        stats = asyncio.run(st.session_state.rag_engine.get_collection_stats())
        
        st.subheader("📈 System Overview")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Total Documents",
                stats.get("total_documents", 0),
                delta=None
            )
        
        with col2:
            st.metric(
                "Total Chunks",
                stats.get("total_chunks", 0),
                delta=None
            )
        
        with col3:
            st.metric(
                "Total Tokens",
                f"{stats.get('total_tokens', 0):,}",
                delta=None
            )
        
        with col4:
            st.metric(
                "Avg Tokens/Chunk",
                f"{stats.get('avg_tokens_per_chunk', 0):.1f}",
                delta=None
            )
        
    except Exception as e:
        st.error(f"Failed to load system statistics: {str(e)}")
    
    # Query history analytics
    if st.session_state.query_history:
        st.subheader("🔍 Query Analytics")
        
        history_df = pd.DataFrame(st.session_state.query_history)
        history_df['timestamp'] = pd.to_datetime(history_df['timestamp'])
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Response time chart
            fig_time = px.line(
                history_df,
                x='timestamp',
                y='response_time',
                title='Response Time Over Time',
                labels={'response_time': 'Response Time (seconds)'}
            )
            st.plotly_chart(fig_time, use_container_width=True)
        
        with col2:
            # Token usage chart
            fig_tokens = px.bar(
                history_df.tail(20),
                x='timestamp',
                y='tokens',
                title='Token Usage (Last 20 Queries)',
                labels={'tokens': 'Tokens Used'}
            )
            st.plotly_chart(fig_tokens, use_container_width=True)
        
        # Summary statistics
        st.subheader("📊 Query Summary")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Queries", len(history_df))
        with col2:
            st.metric("Avg Response Time", f"{history_df['response_time'].mean():.2f}s")
        with col3:
            st.metric("Avg Sources per Query", f"{history_df['sources'].mean():.1f}")
        with col4:
            st.metric("Total Tokens Used", f"{history_df['tokens'].sum():,}")


def show_settings_page():
    """Display settings and configuration."""
    st.header("⚙️ Settings")
    
    # Current configuration
    st.subheader("🔧 Current Configuration")
    
    config_dict = {
        "OpenAI Model": settings.openai.chat_model,
        "Embedding Model": settings.openai.embedding_model,
        "Chunk Size": settings.chunking.size,
        "Chunk Overlap": settings.chunking.overlap,
        "Top K Results": settings.retrieval.top_k,
        "Similarity Threshold": settings.retrieval.similarity_threshold,
        "Max Tokens": settings.openai.max_tokens,
        "Temperature": settings.openai.temperature,
    }
    
    config_df = pd.DataFrame(list(config_dict.items()), columns=["Setting", "Value"])
    st.dataframe(config_df, use_container_width=True)
    
    # Environment check
    st.subheader("🌍 Environment Check")
    
    env_checks = {
        "OpenAI API Key": bool(os.getenv("OPENAI_API_KEY")),
        "Supabase URL": bool(os.getenv("SUPABASE_URL")),
        "Supabase Key": bool(os.getenv("SUPABASE_KEY")),
        "Langfuse Keys": bool(os.getenv("LANGFUSE_PUBLIC_KEY")) and bool(os.getenv("LANGFUSE_SECRET_KEY")),
    }
    
    for check, status in env_checks.items():
        if status:
            st.success(f"✅ {check}: Configured")
        else:
            st.error(f"❌ {check}: Missing")
    
    # Clear data
    st.subheader("🗑️ Data Management")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🧹 Clear Query History"):
            st.session_state.query_history = []
            st.success("Query history cleared!")
    
    with col2:
        document_id = st.text_input("Document ID to delete:")
        if st.button("🗑️ Delete Document") and document_id:
            try:
                result = asyncio.run(st.session_state.rag_engine.delete_document(document_id))
                if result["success"]:
                    st.success(f"Deleted {result['deleted_chunks']} chunks from document {document_id}")
                else:
                    st.warning(f"Document {document_id} not found")
            except Exception as e:
                st.error(f"Failed to delete document: {str(e)}")


if __name__ == "__main__":
    main()