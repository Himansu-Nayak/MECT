import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "MECT HIm Independent AI Engine"
    VERSION: str = "2.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    HOST: str = "127.0.0.1"
    PORT: int = 8082
    
    # Model configuration
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(__file__), "..", "models", "qwen2.5-3b-mect-q4_k_m.gguf")
    )
    FALLBACK_MODEL_PATH: str = os.getenv(
        "FALLBACK_MODEL_PATH",
        os.path.join(os.path.dirname(__file__), "..", "models", "qwen2.5-1.5b-instruct-q4_k_m.gguf")
    )
    CPU_THREADS: int = int(os.getenv("CPU_THREADS", "3"))
    CONTEXT_WINDOW: int = 2048
    MAX_CONCURRENT_INFERENCES: int = int(os.getenv("MAX_CONCURRENT_INFERENCES", "2"))
    INFERENCE_QUEUE_TIMEOUT_SEC: float = float(os.getenv("INFERENCE_QUEUE_TIMEOUT_SEC", "0.25"))
    
    # Qdrant & RAG configuration
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://127.0.0.1:6333")
    COLLECTION_NAME: str = "mect_knowledge_v1"
    EMBEDDING_MODEL: str = "BAAI/bge-m3"
    
    # Standardized security token for internal communication (Fail-Closed if missing)
    INTERNAL_AI_SECRET: str = os.getenv("INTERNAL_AI_SECRET", "")
    
    # Cloud Fallback (Groq)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
