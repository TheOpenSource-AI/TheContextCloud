"""
NER Service — Entity extraction using spaCy.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class NERService:
    def __init__(self):
        self._nlp = None

    def load(self):
        """Load the spaCy NER model."""
        try:
            import spacy
            self._nlp = spacy.load("en_core_web_sm")
            logger.info("✓ spaCy model 'en_core_web_sm' loaded")
        except OSError:
            logger.warning("⚠ spaCy model not found. Run: python -m spacy download en_core_web_sm")
            self._nlp = None

    def is_loaded(self) -> bool:
        return self._nlp is not None

    def extract_batch(self, records: list[dict]) -> list[dict]:
        """
        Extract named entities from a batch of records.
        Each record is a dict with text fields.
        Returns a list of extracted entities with types and confidence.
        """
        if not self._nlp:
            return self._fallback_extraction(records)

        results = []
        for record in records:
            text = " ".join(str(v) for v in record.values() if v)
            doc = self._nlp(text)

            for ent in doc.ents:
                results.append({
                    "name": ent.text,
                    "type": self._map_spacy_label(ent.label_),
                    "spacy_label": ent.label_,
                    "confidence_score": round(ent.kb_id_ if ent.kb_id_ else 0.85, 2),
                    "pii_detected": ent.label_ in ("PERSON", "GPE", "DATE", "MONEY"),
                    "source_text": text[:200],
                })

        # Deduplicate by name
        seen = set()
        unique = []
        for e in results:
            if e["name"] not in seen:
                seen.add(e["name"])
                unique.append(e)

        return unique

    def _map_spacy_label(self, label: str) -> str:
        """Map spaCy entity labels to Context Cloud entity types."""
        mapping = {
            "ORG": "customer",
            "PERSON": "customer",
            "PRODUCT": "product",
            "MONEY": "transaction",
            "DATE": "event",
            "GPE": "location",
            "LAW": "policy",
        }
        return mapping.get(label, "unknown")

    def _fallback_extraction(self, records: list[dict]) -> list[dict]:
        """When spaCy isn't available, do simple keyword-based extraction."""
        results = []
        for record in records:
            name = record.get("name") or record.get("Name") or record.get("entity_name", "")
            if name:
                results.append({
                    "name": name,
                    "type": record.get("type", "unknown"),
                    "confidence_score": 0.70,
                    "pii_detected": False,
                    "source_text": str(record)[:200],
                })
        return results
