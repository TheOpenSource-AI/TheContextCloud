"""
Context Cloud — Python AI Engine
Provides NER extraction, embedding generation, and relationship inference via gRPC.
"""
import asyncio
import logging
from concurrent import futures

import grpc
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.services.ner_service import NERService
from app.services.embedding_service import EmbeddingService
from app.services.relationship_service import RelationshipService
from app.grpc_server import AIEngineServicer, start_grpc_server

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ── Global service instances ────────────────────
ner_service = NERService()
embedding_service = EmbeddingService()
relationship_service = RelationshipService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: load models. Shutdown: cleanup."""
    logger.info("🧠 Loading NLP models...")
    ner_service.load()
    embedding_service.load()
    logger.info("✓ All models loaded")

    # Start gRPC server in background
    grpc_task = asyncio.create_task(
        start_grpc_server(ner_service, embedding_service, relationship_service)
    )
    logger.info("✓ gRPC server started on port 50051")

    yield

    grpc_task.cancel()
    logger.info("AI Engine shut down.")


app = FastAPI(
    title="Context Cloud AI Engine",
    description="NER, embeddings, and relationship inference for the Context Cloud platform.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "models": {
            "ner": ner_service.is_loaded(),
            "embeddings": embedding_service.is_loaded(),
        },
    }


@app.post("/api/extract")
async def extract_entities(payload: dict):
    """REST endpoint for testing NER extraction (use gRPC in production)."""
    records = payload.get("records", [])
    results = ner_service.extract_batch(records)
    return {"entities": results}


@app.post("/api/embed")
async def generate_embeddings(payload: dict):
    """REST endpoint for testing embedding generation."""
    texts = payload.get("texts", [])
    embeddings = embedding_service.encode(texts)
    return {"embeddings": [{"text": t, "dimensions": len(e)} for t, e in zip(texts, embeddings)]}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8081, reload=True)
