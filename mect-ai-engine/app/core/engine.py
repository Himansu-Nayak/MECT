import os
import logging
import asyncio
import threading
from typing import AsyncGenerator, Generator, Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger("mect_ai.engine")

class LocalInferenceEngine:
    """
    Independent local inference engine utilizing llama-cpp-python for GGUF models.
    Engineered with thread-safe serialization, async queue offloading, and client
    cancellation detection for low-resource VPS stability.
    """
    def __init__(self):
        self.llm = None
        self.active_model_path = ""
        self.is_loaded = False
        self._inference_lock = threading.Lock()

    def load_model(self):
        if self.is_loaded and self.llm is not None:
            return

        primary_path = settings.MODEL_PATH
        fallback_path = settings.FALLBACK_MODEL_PATH

        target_path = primary_path if os.path.exists(primary_path) else fallback_path

        if not os.path.exists(target_path):
            logger.warning(
                f"No GGUF model found at {primary_path} or {fallback_path}. "
                "Local inference will defer to Groq fallback."
            )
            return

        try:
            from llama_cpp import Llama
            logger.info(f"Loading GGUF model: {target_path} (threads={settings.CPU_THREADS})...")
            self.llm = Llama(
                model_path=target_path,
                n_ctx=settings.CONTEXT_WINDOW,
                n_threads=settings.CPU_THREADS,
                verbose=False,
            )
            self.active_model_path = target_path
            self.is_loaded = True
            logger.info("Llama engine initialized successfully on CPU!")
        except Exception as e:
            logger.error(f"Failed to load Llama engine: {e}")
            self.llm = None
            self.is_loaded = False

    def stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        max_tokens: int = 512,
        stop_event: Optional[threading.Event] = None,
    ) -> Generator[str, None, None]:
        """
        Synchronous token-by-token generator interfacing with llama-cpp-python.
        Respects stop_event cancellation flags to halt token generation immediately.
        """
        self.load_model()

        if self.llm is None:
            raise RuntimeError("Local LLM weights not loaded on VPS.")

        with self._inference_lock:
            response = self.llm.create_chat_completion(
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
            )

            for chunk in response:
                if stop_event and stop_event.is_set():
                    logger.info("Inference loop cancelled via stop_event.")
                    break
                delta = chunk["choices"][0].get("delta", {})
                content = delta.get("content", "")
                if content:
                    yield content

    async def async_stream_chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        max_tokens: int = 512,
        stop_event: Optional[threading.Event] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Async generator wrapper offloading synchronous C++ inference from the
        FastAPI asyncio event loop into a dedicated daemon worker thread.
        Tokens are piped through an asyncio.Queue, preserving responsiveness.
        """
        if stop_event is None:
            stop_event = threading.Event()

        loop = asyncio.get_running_loop()
        queue: asyncio.Queue = asyncio.Queue()
        sentinel = object()

        def worker():
            try:
                for token in self.stream_chat(
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    stop_event=stop_event,
                ):
                    if stop_event.is_set():
                        break
                    loop.call_soon_threadsafe(queue.put_nowait, token)
            except Exception as exc:
                loop.call_soon_threadsafe(queue.put_nowait, exc)
            finally:
                loop.call_soon_threadsafe(queue.put_nowait, sentinel)

        thread = threading.Thread(target=worker, daemon=True, name="llama-inference-worker")
        thread.start()

        try:
            while True:
                item = await queue.get()
                if item is sentinel:
                    break
                if isinstance(item, Exception):
                    raise item
                yield item
        finally:
            stop_event.set()

engine = LocalInferenceEngine()

