"""
Relationship Service — Infers relationships between extracted entities.
Uses co-occurrence analysis and heuristic rules for the MVP.
"""
import logging
from itertools import combinations

logger = logging.getLogger(__name__)


class RelationshipService:
    # Heuristic relationship rules based on entity type pairs
    RULES = {
        ("customer", "policy"): "OWNS",
        ("policy", "product"): "INSTANCE_OF",
        ("claim", "policy"): "COVERED_BY",
        ("customer", "claim"): "FILED",
        ("claim", "supplier"): "ASSIGNED_TO",
        ("policy", "transaction"): "HAS_TRANSACTION",
        ("supplier", "transaction"): "SUBMITTED",
        ("customer", "customer"): "RELATED_TO",
        ("supplier", "supplier"): "COMPETITOR",
        ("product", "product"): "SOLD_WITH",
    }

    def infer(self, entities: list[dict]) -> list[dict]:
        """
        Given a list of extracted entities, infer likely relationships
        based on co-occurrence and type-pair heuristics.
        """
        relationships = []

        for e1, e2 in combinations(entities, 2):
            type_pair = (e1.get("type", "unknown"), e2.get("type", "unknown"))
            reverse_pair = (type_pair[1], type_pair[0])

            rel_type = self.RULES.get(type_pair) or self.RULES.get(reverse_pair)
            if not rel_type:
                continue

            # Confidence is the geometric mean of both entity confidences, discounted
            c1 = e1.get("confidence_score", 0.5)
            c2 = e2.get("confidence_score", 0.5)
            confidence = round((c1 * c2) ** 0.5 * 0.85, 2)  # 15% discount for inference uncertainty

            # Determine direction (first type in RULES is the source)
            if type_pair in self.RULES:
                source, target = e1, e2
            else:
                source, target = e2, e1

            relationships.append({
                "source_id": source.get("external_id", source.get("name")),
                "target_id": target.get("external_id", target.get("name")),
                "type": rel_type,
                "confidence_score": confidence,
            })

        logger.info(f"Inferred {len(relationships)} relationships from {len(entities)} entities")
        return relationships
