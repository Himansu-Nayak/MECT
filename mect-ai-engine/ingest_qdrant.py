"""
MAHAVIR TRUST (MECT) — Qdrant Hybrid Knowledge Ingestion Script
Embeds authoritative chunks using FastEmbed (BAAI/bge-m3 ONNX) and indexes into Qdrant.
Supports both local file-based Qdrant and live Qdrant daemon on 127.0.0.1:6333.
"""

import json
import os
import sys

def main():
    print("==================================================================")
    print("MAHAVIR TRUST (MECT) — Qdrant Vector Knowledge Ingestion Engine")
    print("==================================================================")

    chunks_file = os.path.join(os.path.dirname(__file__), "mect_knowledge_chunks.json")
    if not os.path.exists(chunks_file):
        print(f"Error: {chunks_file} not found. Please run ingest_knowledge.mjs first.")
        sys.exit(1)

    with open(chunks_file, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    print(f"Loaded {len(chunks)} verified semantic chunks.")

    # Try importing Qdrant and FastEmbed
    try:
        from qdrant_client import QdrantClient
        from qdrant_client.models import Distance, VectorParams, PointStruct
        from fastembed import TextEmbedding
    except ImportError as e:
        print(f"Notice: Python ML dependencies not installed locally ({e}).")
        print("To install on Hostinger VPS / Python env: pip install qdrant-client fastembed")
        print("Knowledge chunks remain pre-compiled and verified in mect_knowledge_chunks.json.")
        return

    qdrant_url = os.getenv("QDRANT_URL", "http://127.0.0.1:6333")
    collection_name = "mect_knowledge_v1"

    print(f"\nConnecting to Qdrant at: {qdrant_url}...")
    try:
        client = QdrantClient(url=qdrant_url)
    except Exception as e:
        print(f"Live Qdrant daemon not reachable at {qdrant_url}. Using local disk storage './qdrant_data'.")
        client = QdrantClient(path="./qdrant_data")

    print("Initializing FastEmbed multilingual model: BAAI/bge-m3...")
    embedding_model = TextEmbedding(model_name="BAAI/bge-m3")

    # Recreate collection
    print(f"Ensuring collection '{collection_name}' exists...")
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
    )

    documents_text = [c["content"] for c in chunks]
    print(f"Computing dense embeddings for {len(documents_text)} chunks...")
    embeddings = list(embedding_model.embed(documents_text))

    points = []
    for idx, (chunk, vector) in enumerate(zip(chunks, embeddings)):
        points.append(
            PointStruct(
                id=idx + 1,
                vector=vector.tolist(),
                payload={
                    "chunk_id": chunk["id"],
                    "doc_id": chunk["doc_id"],
                    "section": chunk["section"],
                    "citation": chunk["citation"],
                    "verification_status": chunk["verification_status"],
                    "sha256": chunk["sha256"],
                    "text": chunk["content"],
                },
            )
        )

    client.upsert(collection_name=collection_name, points=points)
    print(f"\nSUCCESS: Ingested {len(points)} verified chunks into '{collection_name}'!")
    print("==================================================================")

if __name__ == "__main__":
    main()

