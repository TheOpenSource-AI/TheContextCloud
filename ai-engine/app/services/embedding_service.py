"""
Embedding Service — Vector generation using sentence-transformers.
"""
import logging
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self._model_name = model_name
        self._model = None

    def load(self):
        """Load the sentence-transformer model."""
        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self._model_name)
            logger.info(f"✓ Embedding model '{self._model_name}' loaded (dim={self._model.get_sentence_embedding_dimension()})")
        except Exception as e:
            logger.warning(f"⚠ Failed to load embedding model: {e}")
            self._model = None

    def is_loaded(self) -> bool:
        return self._model is not None

    def encode(self, texts: list[str]) -> list[list[float]]:
        """
        Generate embeddings for a list of texts.
        Returns a list of 384-dimensional float vectors.
        """
        if not self._model:
            return self._fallback_encode(texts)

        embeddings = self._model.encode(texts, normalize_embeddings=True)
        return [emb.tolist() for emb in embeddings]

    def encode_single(self, text: str) -> list[float]:
        """Generate embedding for a single text."""
        results = self.encode([text])
        return results[0] if results else []

    def _fallback_encode(self, texts: list[str]) -> list[list[float]]:
        """When model isn't available, return deterministic mock embeddings."""
        logger.warning("Using fallback (random) embeddings — not for production use")
        return [np.random.randn(384).tolist() for _ in texts]
