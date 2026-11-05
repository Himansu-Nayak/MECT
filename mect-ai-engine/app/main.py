import json
import logging
import time
import os
import hmac
import asyncio
import threading
from typing import List, Optional
from fastapi import FastAPI, Header, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field

from app.config import settings
from app.core.engine import engine
from app.core.rag import rag_engine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("mect_ai.main")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Independent institutional AI engine for Mahavir Trust (MECT)",
)

# CORS restricted strictly to internal Next.js instances
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://mect.org.in",
        "https://www.mect.org.in"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

def verify_internal_secret(x_internal_token: Optional[str] = Header(None)) -> bool:
    """
    Constant-time authentication verification for all protected internal endpoints.
    Fails closed if INTERNAL_AI_SECRET is unconfigured or blank.
    No hardcoded bypass tokens are accepted.
    """
    configured_secret = settings.INTERNAL_AI_SECRET.strip() if settings.INTERNAL_AI_SECRET else ""
    if not configured_secret or len(configured_secret) < 16:
        logger.critical("[Security Violation] INTERNAL_AI_SECRET is missing or insufficiently strong (<16 chars). Failing closed.")
        raise HTTPException(
            status_code=500,
            detail="Server security configuration error: internal secret is unconfigured."
        )

    if not x_internal_token or not hmac.compare_digest(x_internal_token.strip(), configured_secret):
        logger.warning("[Security] Unauthorized request rejected on protected endpoint.")
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: invalid or missing internal authentication token."
        )

    return True

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(system|user|assistant)$")
    content: str = Field(..., max_length=2000)

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    preferred_language: Optional[str] = "en"
    temperature: Optional[float] = 0.3
    max_tokens: Optional[int] = 512
    stream: Optional[bool] = True

class SearchQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

@app.get("/v1/health")
async def health_check():
    """
    Sanitized health probe reporting operational telemetry without exposing
    paths, secrets, environment variables, or private internal credentials.
    """
    import psutil
    mem = psutil.virtual_memory()
    load = psutil.getloadavg() if hasattr(psutil, "getloadavg") else (0.0, 0.0, 0.0)

    model_present = bool(
        (settings.MODEL_PATH and os.path.exists(settings.MODEL_PATH)) or
        (settings.FALLBACK_MODEL_PATH and os.path.exists(settings.FALLBACK_MODEL_PATH))
    )

    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "model_file_present": model_present,
        "engine_loaded": engine.is_loaded,
        "cpu_load_1m": round(load[0], 2),
        "ram_available_mb": round(mem.available / (1024 * 1024), 1),
        "ram_percent_used": round(mem.percent, 1),
        "auth_configured": bool(settings.INTERNAL_AI_SECRET and len(settings.INTERNAL_AI_SECRET) >= 16),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }

@app.post("/v1/rag/search", dependencies=[Depends(verify_internal_secret)])
async def search_knowledge(req: SearchQueryRequest):
    """
    Protected semantic RAG search endpoint.
    """
    excerpts, citations = rag_engine.retrieve(req.query, top_k=req.top_k)
    return {
        "query": req.query,
        "count": len(excerpts),
        "citations": citations,
        "excerpts": excerpts,
    }

_inference_semaphore: Optional[asyncio.Semaphore] = None

def get_inference_semaphore() -> asyncio.Semaphore:
    global _inference_semaphore
    if _inference_semaphore is None:
        _inference_semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT_INFERENCES)
    return _inference_semaphore

@app.post("/v1/chat/completions", dependencies=[Depends(verify_internal_secret)])
async def chat_completions(req: ChatCompletionRequest, request: Request):
    """
    Protected SSE streaming chat completions endpoint with async offloading,
    concurrency limiting, and client abort detection.
    """
    if not req.messages:
        raise HTTPException(status_code=400, detail="Empty messages payload.")

    sem = get_inference_semaphore()
    try:
        await asyncio.wait_for(sem.acquire(), timeout=settings.INFERENCE_QUEUE_TIMEOUT_SEC)
    except asyncio.TimeoutError:
        logger.warning(
            f"Local inference capacity saturated ({settings.MAX_CONCURRENT_INFERENCES} active). Returning 503 for fast failover."
        )
        raise HTTPException(
            status_code=503,
            detail="Inference capacity temporarily saturated. Defer to cloud fallback.",
            headers={"Retry-After": "2"},
        )

    user_query = req.messages[-1].content
    excerpts, citations = rag_engine.retrieve(user_query, top_k=2)

    # Context grounder
    rag_context = "\n\n".join(excerpts)
    grounded_system_prompt = (
        f"You are HIm, official digital assistant of Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST).\n"
        f"Strict Factual Knowledge:\n{rag_context}\n\n"
        f"Policy: 100% Direct-to-College disbursals only. Zero cash policy. 30 districts of Odisha. Free application.\n"
        f"Answer in the user's language ({req.preferred_language}). Include citation footnote if appropriate."
    )

    formatted_messages = [{"role": "system", "content": grounded_system_prompt}]
    for m in req.messages[-6:]:
        formatted_messages.append({"role": m.role, "content": m.content})

    async def sse_stream_generator():
        stop_event = threading.Event()
        try:
            async for token in engine.async_stream_chat(
                messages=formatted_messages,
                temperature=req.temperature,
                max_tokens=req.max_tokens,
                stop_event=stop_event,
            ):
                # Detect client disconnect to halt background inference thread immediately
                if await request.is_disconnected():
                    logger.info("Client disconnected mid-stream; stopping background inference worker.")
                    stop_event.set()
                    break

                payload = json.dumps({"text": token})
                yield f"data: {payload}\n\n"

            # Append citations at the end of the stream if completed without cancellation
            if not stop_event.is_set() and citations:
                citation_text = "\n\n*Verified References:*\n" + "\n".join(f"- {c}" for c in citations)
                yield f"data: {json.dumps({'text': citation_text})}\n\n"

            if not stop_event.is_set():
                yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Inference streaming error: {e}")
            err_payload = json.dumps({"error": str(e), "fallback_recommended": True})
            yield f"data: {err_payload}\n\n"
        finally:
            stop_event.set()
            sem.release()

    return StreamingResponse(
        sse_stream_generator(),
        media_type="text/event-stream; charset=utf-8",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
