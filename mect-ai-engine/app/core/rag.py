import os
import json
import logging
from typing import List, Dict, Any, Tuple
from app.config import settings

logger = logging.getLogger("mect_ai.rag")

CROSS_LINGUAL_SYNONYMS = {
    "districts": ["ଜିଲ୍ଲା", "ଜିଲ୍ଲାରେ", "ଜିଲ୍ଲାର", "जिले", "जिलों", "district", "districts", "30"],
    "cash_policy": ["ନଗଦ", "ନଗଦବିହୀନ", "ନଗଦ ଟଙ୍କା", "नकद", "कैश", "नकद-मुक्त", "cash", "zero cash"],
    "direct_college": ["କଲେଜ", "କଲେଜକୁ", "ବିଶ୍ୱବିଦ୍ୟାଳୟ", "कॉलेज", "विश्वविद्यालय", "college", "direct-to-college", "bursar", "registrar"],
    "scholarships": ["ଛାତ୍ରବୃତ୍ତି", "ବୃତ୍ତି", "ଛାତ୍ରବୃତ୍ତିର", "ପ୍ରୋତ୍ସାହନ", "छात्रवृत्ति", "स्कॉलरशिप", "प्रोत्साहन", "फेलोशिप", "scholarship", "fellowship", "merit"],
    "eligibility": ["ଯୋଗ୍ୟତା", "ମାନଦଣ୍ଡ", "ବାସିନ୍ଦା", "पात्रता", "मानदंड", "निवासी", "eligibility", "income", "60%", "2,50,000"],
    "tax_status": ["୮୦g", "80g", "୧୨a", "12a", "ଟ୍ୟାକ୍ସ", "ଛାଡ଼", "टैक्स", "छूट", "tax", "exemption"],
    "contact_info": ["ଯୋଗାଯୋଗ", "ସମ୍ପର୍କ", "ସଚିବାଳୟ", "ଇମେଲ", "संपर्क", "सचिवालय", "ईमेल", "contact", "email", "bhubaneswar", "address"],
}

def detect_query_language(text: str) -> str:
    """Detects primary script of user prompt (Odia, Devanagari/Hindi, or Latin/English)"""
    for char in text:
        code = ord(char)
        if 0x0B00 <= code <= 0x0B7F:
            return "or"
        if 0x0900 <= code <= 0x097F:
            return "hi"
    return "en"

class HybridRAGEngine:
    """
    Multilingual hybrid RAG engine with vector search (Qdrant) and
    language-aware in-memory lexical fallback.
    """
    def __init__(self):
        self.chunks_cache: List[Dict[str, Any]] = []
        self.embedding_model = None
        self.qdrant_client = None
        self._load_fallback_chunks()

    def _load_fallback_chunks(self):
        chunks_file = os.path.join(os.path.dirname(__file__), "..", "..", "mect_knowledge_chunks.json")
        if os.path.exists(chunks_file):
            try:
                with open(chunks_file, "r", encoding="utf-8") as f:
                    self.chunks_cache = json.load(f)
                logger.info(f"Loaded {len(self.chunks_cache)} multilingual knowledge chunks from JSON.")
            except Exception as e:
                logger.warning(f"Could not load fallback chunks JSON: {e}")

    def initialize(self):
        """Lazy initialization of vector clients to prevent memory overhead if idle"""
        if self.qdrant_client is None:
            try:
                from qdrant_client import QdrantClient
                self.qdrant_client = QdrantClient(url=settings.QDRANT_URL, timeout=3.0)
                logger.info(f"Connected to Qdrant at {settings.QDRANT_URL}")
            except Exception as e:
                logger.warning(f"Qdrant connection failed ({e}). Operating in memory-fallback mode.")
                self.qdrant_client = None

        if self.embedding_model is None and self.qdrant_client is not None:
            try:
                from fastembed import TextEmbedding
                self.embedding_model = TextEmbedding(model_name=settings.EMBEDDING_MODEL)
                logger.info("FastEmbed BAAI/bge-m3 initialized successfully.")
            except Exception as e:
                logger.warning(f"FastEmbed init failed ({e}).")
                self.embedding_model = None

    def retrieve(self, query: str, top_k: int = 3) -> Tuple[List[str], List[str]]:
        """
        Retrieves top_k authoritative excerpts and corresponding citation strings
        with multilingual keyword matching and provenance verification.
        Returns: (excerpts, citations)
        """
        self.initialize()
        query_lang = detect_query_language(query)

        # 1. Try Qdrant Vector Retrieval
        if self.qdrant_client and self.embedding_model:
            try:
                query_vector = list(self.embedding_model.embed([query]))[0].tolist()
                results = self.qdrant_client.search(
                    collection_name=settings.COLLECTION_NAME,
                    query_vector=query_vector,
                    limit=top_k,
                )
                excerpts = []
                citations = []
                for hit in results:
                    text = hit.payload.get("text", "")
                    citation = hit.payload.get("citation", "[Doc: MECT Charter]")
                    if text:
                        excerpts.append(text)
                        citations.append(citation)
                if excerpts:
                    return excerpts, list(dict.fromkeys(citations))
            except Exception as e:
                logger.warning(f"Qdrant search error: {e}. Falling back to multilingual lexical scan.")

        # 2. Resilient Multilingual In-Memory Lexical Fallback
        query_terms = [t.lower() for t in query.replace("?", "").replace(",", "").split() if len(t) >= 2]

        # Identify semantic concept flags triggered by query
        active_concepts = set()
        for concept, synonyms in CROSS_LINGUAL_SYNONYMS.items():
            for syn in synonyms:
                if syn in query.lower():
                    active_concepts.add(concept)
                    break

        scored_chunks = []

        for chunk in self.chunks_cache:
            content_lower = chunk["content"].lower()
            chunk_lang = chunk.get("language", "en")
            score = 0

            # Match exact query terms
            for term in query_terms:
                if term in content_lower:
                    score += 3

            # Match cross-lingual concepts
            for concept in active_concepts:
                synonyms = CROSS_LINGUAL_SYNONYMS[concept]
                for syn in synonyms:
                    if syn in content_lower:
                        score += 5
                        break

            # Language affinity bonus
            if chunk_lang == query_lang and score > 0:
                score += 4

            if score > 0:
                scored_chunks.append((score, chunk))

        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_matches = scored_chunks[:top_k]

        excerpts = [c["content"] for _, c in top_matches]
        citations = [c["citation"] for _, c in top_matches]

        # If zero match or query in Odia/Hindi, ensure foundational master English + matching language chunk
        if not excerpts and self.chunks_cache:
            # Find default chunk in matching language if available
            matched_default = next(
                (c for c in self.chunks_cache if c.get("language") == query_lang),
                self.chunks_cache[0]
            )
            excerpts = [matched_default["content"]]
            citations = [matched_default["citation"]]

        # If query is non-English and we matched non-English chunks, also append authoritative English master
        if query_lang in ("or", "hi") and top_matches:
            top_section = top_matches[0][1].get("section", "")
            # Find corresponding English master section chunk
            eng_counterpart = next(
                (c for c in self.chunks_cache if c.get("language") == "en" and top_section[:12] in c.get("section", "")),
                None
            )
            if eng_counterpart and eng_counterpart["content"] not in excerpts:
                excerpts.append(f"[Authoritative Master Reference (English)]:\n{eng_counterpart['content']}")
                citations.append(eng_counterpart["citation"])

        return excerpts, list(dict.fromkeys(citations))

rag_engine = HybridRAGEngine()
