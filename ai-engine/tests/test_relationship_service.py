"""
Unit tests for the Relationship Inference Service.
"""
import unittest
from app.services.relationship_service import RelationshipService


class TestRelationshipService(unittest.TestCase):

    def setUp(self):
        self.service = RelationshipService()

    def test_customer_policy_relationship(self):
        """Customer + Policy should infer OWNS relationship."""
        entities = [
            {"name": "Acme Corp", "type": "customer", "confidence_score": 0.98},
            {"name": "CP-2041", "type": "policy", "confidence_score": 0.95},
        ]
        rels = self.service.infer(entities)
        self.assertEqual(len(rels), 1)
        self.assertEqual(rels[0]["type"], "OWNS")
        self.assertGreater(rels[0]["confidence_score"], 0)

    def test_claim_policy_relationship(self):
        """Claim + Policy should infer COVERED_BY."""
        entities = [
            {"name": "CLM-301", "type": "claim", "confidence_score": 0.90},
            {"name": "CP-2041", "type": "policy", "confidence_score": 0.95},
        ]
        rels = self.service.infer(entities)
        self.assertEqual(len(rels), 1)
        self.assertEqual(rels[0]["type"], "COVERED_BY")

    def test_no_relationship_for_unknown_pair(self):
        """Two 'unknown' type entities should not produce relationships."""
        entities = [
            {"name": "A", "type": "unknown", "confidence_score": 0.5},
            {"name": "B", "type": "unknown", "confidence_score": 0.5},
        ]
        rels = self.service.infer(entities)
        self.assertEqual(len(rels), 0)

    def test_multiple_entities_combinatorial(self):
        """3 entities should check all C(3,2)=3 pairs."""
        entities = [
            {"name": "Customer", "type": "customer", "confidence_score": 0.98},
            {"name": "Policy", "type": "policy", "confidence_score": 0.95},
            {"name": "Claim", "type": "claim", "confidence_score": 0.90},
        ]
        rels = self.service.infer(entities)
        # Should find: customer-policy (OWNS), customer-claim (FILED), claim-policy (COVERED_BY)
        self.assertEqual(len(rels), 3)
        rel_types = {r["type"] for r in rels}
        self.assertIn("OWNS", rel_types)
        self.assertIn("FILED", rel_types)
        self.assertIn("COVERED_BY", rel_types)

    def test_empty_entities(self):
        """Empty entity list should return empty relationships."""
        rels = self.service.infer([])
        self.assertEqual(len(rels), 0)

    def test_single_entity(self):
        """Single entity should produce no relationships."""
        entities = [{"name": "Solo", "type": "customer", "confidence_score": 0.95}]
        rels = self.service.infer(entities)
        self.assertEqual(len(rels), 0)

    def test_confidence_discount(self):
        """Inferred confidence should be discounted (< geometric mean of inputs)."""
        entities = [
            {"name": "A", "type": "customer", "confidence_score": 1.0},
            {"name": "B", "type": "policy", "confidence_score": 1.0},
        ]
        rels = self.service.infer(entities)
        # With two 1.0 scores, geometric mean is 1.0, discounted by 0.85 = 0.85
        self.assertAlmostEqual(rels[0]["confidence_score"], 0.85, places=2)

    def test_supplier_relationships(self):
        """Supplier pairs should be COMPETITOR."""
        entities = [
            {"name": "Supplier A", "type": "supplier", "confidence_score": 0.8},
            {"name": "Supplier B", "type": "supplier", "confidence_score": 0.9},
        ]
        rels = self.service.infer(entities)
        self.assertEqual(len(rels), 1)
        self.assertEqual(rels[0]["type"], "COMPETITOR")


if __name__ == "__main__":
    unittest.main()
