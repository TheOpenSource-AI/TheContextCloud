"""
Unit tests for the NER Service.
"""
import unittest
from app.services.ner_service import NERService


class TestNERService(unittest.TestCase):

    def setUp(self):
        self.service = NERService()
        # Don't load spaCy model in tests — use fallback extraction

    def test_is_loaded_initially_false(self):
        """Service should not be loaded until load() is called."""
        self.assertFalse(self.service.is_loaded())

    def test_fallback_extraction_with_name_field(self):
        """Fallback extraction should find entities from 'name' column."""
        records = [
            {"name": "Acme Corp", "type": "customer"},
            {"name": "Global Inc", "type": "supplier"},
        ]
        results = self.service.extract_batch(records)

        self.assertEqual(len(results), 2)
        self.assertEqual(results[0]["name"], "Acme Corp")
        self.assertEqual(results[0]["type"], "customer")
        self.assertEqual(results[1]["name"], "Global Inc")

    def test_fallback_extraction_with_Name_field(self):
        """Fallback should handle capitalized 'Name' key."""
        records = [{"Name": "Test Entity"}]
        results = self.service.extract_batch(records)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Test Entity")

    def test_fallback_extraction_with_entity_name_field(self):
        """Fallback should handle 'entity_name' key."""
        records = [{"entity_name": "Custom Entity"}]
        results = self.service.extract_batch(records)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Custom Entity")

    def test_fallback_extraction_empty_records(self):
        """Empty records should return empty results."""
        results = self.service.extract_batch([])
        self.assertEqual(len(results), 0)

    def test_fallback_extraction_no_name_field(self):
        """Records without name fields should be skipped."""
        records = [{"foo": "bar", "baz": "qux"}]
        results = self.service.extract_batch(records)
        self.assertEqual(len(results), 0)

    def test_fallback_confidence_score(self):
        """Fallback should produce 0.70 confidence (lower than AI extraction)."""
        records = [{"name": "Test"}]
        results = self.service.extract_batch(records)
        self.assertEqual(results[0]["confidence_score"], 0.70)

    def test_fallback_pii_not_detected(self):
        """Fallback should not detect PII."""
        records = [{"name": "Test"}]
        results = self.service.extract_batch(records)
        self.assertFalse(results[0]["pii_detected"])

    def test_map_spacy_label_known(self):
        """Known spaCy labels should map to Context Cloud types."""
        self.assertEqual(self.service._map_spacy_label("ORG"), "customer")
        self.assertEqual(self.service._map_spacy_label("PERSON"), "customer")
        self.assertEqual(self.service._map_spacy_label("PRODUCT"), "product")
        self.assertEqual(self.service._map_spacy_label("MONEY"), "transaction")
        self.assertEqual(self.service._map_spacy_label("GPE"), "location")
        self.assertEqual(self.service._map_spacy_label("LAW"), "policy")

    def test_map_spacy_label_unknown(self):
        """Unknown spaCy labels should map to 'unknown'."""
        self.assertEqual(self.service._map_spacy_label("NORP"), "unknown")
        self.assertEqual(self.service._map_spacy_label("CARDINAL"), "unknown")


if __name__ == "__main__":
    unittest.main()
