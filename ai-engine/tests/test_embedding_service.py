"""
Unit tests for the Embedding Service.
"""
import unittest
from app.services.embedding_service import EmbeddingService


class TestEmbeddingService(unittest.TestCase):

    def setUp(self):
        self.service = EmbeddingService()
        # Don't load the actual model — use fallback

    def test_is_loaded_initially_false(self):
        """Service should not be loaded until load() is called."""
        self.assertFalse(self.service.is_loaded())

    def test_fallback_encode_returns_correct_dimensions(self):
        """Fallback should return 384-dimensional vectors."""
        embeddings = self.service.encode(["hello world"])
        self.assertEqual(len(embeddings), 1)
        self.assertEqual(len(embeddings[0]), 384)

    def test_fallback_encode_multiple_texts(self):
        """Fallback should handle multiple texts."""
        texts = ["hello", "world", "test"]
        embeddings = self.service.encode(texts)
        self.assertEqual(len(embeddings), 3)
        for emb in embeddings:
            self.assertEqual(len(emb), 384)

    def test_fallback_encode_empty_list(self):
        """Empty text list should return empty embeddings."""
        embeddings = self.service.encode([])
        self.assertEqual(len(embeddings), 0)

    def test_encode_single(self):
        """encode_single should return a single 384-dim vector."""
        embedding = self.service.encode_single("test text")
        self.assertEqual(len(embedding), 384)

    def test_fallback_encode_returns_floats(self):
        """All embedding values should be floats."""
        embeddings = self.service.encode(["test"])
        for value in embeddings[0]:
            self.assertIsInstance(value, float)


if __name__ == "__main__":
    unittest.main()
