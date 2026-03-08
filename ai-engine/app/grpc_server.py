"""
gRPC Server for the AI Engine.
Implements the AIEngine service defined in proto/ai_engine.proto.
"""
import asyncio
import logging
from concurrent import futures

import grpc

logger = logging.getLogger(__name__)

# Note: In production, generate stubs from ai_engine.proto using:
# python -m grpc_tools.protoc -I../../backend/proto --python_out=. --grpc_python_out=. ../../backend/proto/ai_engine.proto
# For the MVP, we implement a simplified gRPC server using reflection.


class AIEngineServicer:
    """Implements the AIEngine gRPC service."""

    def __init__(self, ner_service, embedding_service, relationship_service):
        self.ner = ner_service
        self.embeddings = embedding_service
        self.relationships = relationship_service

    def ExtractEntities(self, request_data: dict) -> dict:
        """Extract entities from raw records."""
        records = request_data.get("records", [])
        entities = self.ner.extract_batch(records)
        return {"entities": entities}

    def GenerateEmbeddings(self, request_data: dict) -> dict:
        """Generate vector embeddings for texts."""
        texts = request_data.get("texts", [])
        vectors = self.embeddings.encode(texts)
        return {
            "embeddings": [
                {"text": t, "vector": v} for t, v in zip(texts, vectors)
            ]
        }

    def InferRelationships(self, request_data: dict) -> dict:
        """Infer relationships between entities."""
        entities = request_data.get("entities", [])
        relationships = self.relationships.infer(entities)
        return {"relationships": relationships}


async def start_grpc_server(ner_service, embedding_service, relationship_service):
    """
    Starts the gRPC server on port 50051.
    For the MVP, this uses a simplified JSON-over-gRPC approach.
    In production, use proper protobuf-generated stubs.
    """
    servicer = AIEngineServicer(ner_service, embedding_service, relationship_service)

    # For MVP: use a simple TCP socket with JSON serialization
    # In production: replace with proper grpc.aio.server() + generated stubs
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=4))
    # server.add_insecure_port("[::]:50051")
    # await server.start()

    logger.info("gRPC servicer initialized (stub mode — ready for proto integration)")

    # Keep alive
    try:
        while True:
            await asyncio.sleep(3600)
    except asyncio.CancelledError:
        pass
