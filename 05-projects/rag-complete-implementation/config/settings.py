"""
Configuration settings for the RAG system using Pydantic Settings.
"""
from typing import Optional, List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseSettings):
    """Database configuration settings."""
    
    model_config = SettingsConfigDict(env_prefix="DB_")
    
    host: str = Field(default="localhost", description="Database host")
    port: int = Field(default=5432, description="Database port")
    name: str = Field(default="rag_db", description="Database name")
    user: str = Field(default="postgres", description="Database user")
    password: str = Field(description="Database password")
    
    @property
    def connection_string(self) -> str:
        """Get the database connection string."""
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"


class SupabaseSettings(BaseSettings):
    """Supabase configuration settings."""
    
    model_config = SettingsConfigDict(env_prefix="SUPABASE_")
    
    url: str = Field(description="Supabase project URL")
    key: str = Field(description="Supabase service role key")
    table_name: str = Field(default="documents", description="Table name for document storage")


class OpenAISettings(BaseSettings):
    """OpenAI configuration settings."""
    
    model_config = SettingsConfigDict(env_prefix="OPENAI_")
    
    api_key: str = Field(description="OpenAI API key")
    embedding_model: str = Field(default="text-embedding-3-small", description="Embedding model")
    chat_model: str = Field(default="gpt-4o-mini", description="Chat completion model")
    max_tokens: int = Field(default=1000, description="Maximum tokens for responses")
    temperature: float = Field(default=0.1, description="Temperature for responses")


class ChunkingSettings(BaseSettings):
    """Text chunking configuration settings."""
    
    model_config = SettingsConfigDict(env_prefix="CHUNK_")
    
    size: int = Field(default=1000, description="Chunk size in characters")
    overlap: int = Field(default=200, description="Overlap between chunks")
    separators: List[str] = Field(
        default=["\n\n", "\n", ". ", "! ", "? ", " "],
        description="Chunk separators in order of preference"
    )


class RetrievalSettings(BaseSettings):
    """Retrieval configuration settings."""
    
    model_config = SettingsConfigDict(env_prefix="RETRIEVAL_")
    
    top_k: int = Field(default=5, description="Number of documents to retrieve")
    similarity_threshold: float = Field(default=0.7, description="Minimum similarity score")
    rerank: bool = Field(default=True, description="Enable reranking")
    max_chars: int = Field(default=4000, description="Maximum characters in context")


class LangfuseSettings(BaseSettings):
    """Langfuse observability settings."""
    
    model_config = SettingsConfigDict(env_prefix="LANGFUSE_")
    
    secret_key: Optional[str] = Field(default=None, description="Langfuse secret key")
    public_key: Optional[str] = Field(default=None, description="Langfuse public key")
    host: str = Field(default="https://cloud.langfuse.com", description="Langfuse host")
    enabled: bool = Field(default=True, description="Enable Langfuse tracking")


class AppSettings(BaseSettings):
    """Main application settings."""
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Sub-settings
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    supabase: SupabaseSettings = Field(default_factory=SupabaseSettings)
    openai: OpenAISettings = Field(default_factory=OpenAISettings)
    chunking: ChunkingSettings = Field(default_factory=ChunkingSettings)
    retrieval: RetrievalSettings = Field(default_factory=RetrievalSettings)
    langfuse: LangfuseSettings = Field(default_factory=LangfuseSettings)
    
    # App-specific settings
    app_name: str = Field(default="RAG Complete Implementation", description="Application name")
    version: str = Field(default="1.0.0", description="Application version")
    debug: bool = Field(default=False, description="Debug mode")
    log_level: str = Field(default="INFO", description="Logging level")


# Global settings instance
settings = AppSettings()