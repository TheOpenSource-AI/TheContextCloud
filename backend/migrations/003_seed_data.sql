-- Migration 003: Seed demo data for MVP
-- Insurance domain: Acme Corp with policies, claims, suppliers

-- Demo tenant
INSERT INTO tenants (id, name, slug, plan) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Acme Insurance Demo', 'acme-demo', 'enterprise');

-- Demo user
INSERT INTO users (id, tenant_id, email, name, role) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'admin@acme-demo.com', 'Jane Doe', 'admin');

-- Data sources
INSERT INTO data_sources (id, tenant_id, name, type, confidence_score) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CoreSuite V4', 'database', 0.99),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Legacy Claims DB', 'database', 0.85),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Salesforce CRM', 'api', 0.95),
    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Document OCR Pipeline', 'document', 0.65);

-- Entities (12)
INSERT INTO entities (id, tenant_id, external_id, type, name, description, attributes, confidence_score, pii_masked, data_classification, source_id) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e-cust-102', 'customer', 'Acme Corp', 'Enterprise manufacturing client', '{"industry":"Manufacturing","riskTier":"Medium","annualRevenue":"$50M"}', 0.98, false, 'confidential', 'd0000000-0000-0000-0000-000000000003'),
    ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'e-cust-103', 'customer', 'John Doe (Redacted)', 'Retail policy holder', '{"age":"Confidential","location":"New York"}', 0.99, true, 'restricted', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'e-pol-2041', 'policy', 'Commercial Property CP-2041', 'Coverage for main manufacturing facility', '{"status":"Active","premium":12000,"limit":5000000}', 0.99, false, 'confidential', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'e-pol-2042', 'policy', 'Auto Fleet AF-2042', 'Coverage for 50 delivery vehicles', '{"status":"Active","premium":8000,"limit":2000000}', 0.99, false, 'confidential', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'e-claim-301', 'claim', 'Claim CLM-301 (Fire Damage)', 'Small fire in warehouse sector B', '{"status":"Open","estimatedLoss":25000}', 0.88, false, 'confidential', 'd0000000-0000-0000-0000-000000000002'),
    ('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'e-claim-302', 'claim', 'Claim CLM-302 (Fender Bender)', 'Delivery truck rear-ended', '{"status":"Closed","estimatedLoss":4500}', 0.92, false, 'internal', 'd0000000-0000-0000-0000-000000000002'),
    ('e0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'e-sup-401', 'supplier', 'Rapid Repair Co.', 'Preferred auto repair network', '{"status":"Approved","rating":4.8}', 0.95, false, 'internal', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'e-sup-402', 'supplier', 'Global Builders Inc.', 'Commercial property restoration', '{"status":"Under Review","rating":3.2,"riskFlag":true}', 0.72, false, 'internal', 'd0000000-0000-0000-0000-000000000004'),
    ('e0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'e-prod-501', 'product', 'Platinum Property Protector', 'Flagship commercial property insurance product', '{"category":"Property","lineOfBusiness":"Commercial"}', 1.0, false, 'public', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'e-prod-502', 'product', 'Fleet Guard Standard', 'Standard commercial auto fleet product', '{"category":"Auto","lineOfBusiness":"Commercial"}', 1.0, false, 'public', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'e-txn-601', 'transaction', 'Payment Receipt CHK-992', 'Premium payment for CP-2041', '{"amount":12000,"method":"Wire Transfer","status":"Cleared"}', 0.99, false, 'confidential', 'd0000000-0000-0000-0000-000000000001'),
    ('e0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'e-txn-602', 'transaction', 'Invoice INV-001 (Rapid Repair)', 'Repair invoice for vehicle 12', '{"amount":4500,"status":"Paid"}', 0.68, false, 'confidential', 'd0000000-0000-0000-0000-000000000004');

-- Completed ingestion job (simulates a past successful run)
INSERT INTO ingestion_jobs (id, tenant_id, source_id, status, entities_created, relationships_created, events_created, completed_at) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'completed', 12, 18, 20, NOW());

-- Events (20)
INSERT INTO events (tenant_id, entity_id, type, title, description, metadata, source_id, occurred_at) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'CUSTOMER_ONBOARDED', 'Customer Onboarded', 'Acme Corp account created.', '{}', 'd0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '30 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'POLICY_ISSUED', 'Policy Issued', 'CP-2041 activated.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'POLICY_ISSUED', 'Policy Issued', 'AF-2042 activated.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000011', 'PAYMENT_RECEIVED', 'Payment Cleared', 'Initial premium of $12,000 cleared.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '28 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'CLAIM_OPENED', 'Claim Filed', 'First notice of loss for vehicle accident.', '{}', 'd0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '25 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'CLAIM_ASSIGNED', 'Supplier Assigned', 'Assigned to Rapid Repair Co.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '24 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'INSPECTION_COMPLETED', 'Inspection Passed', 'Vehicle inspected by shop.', '{}', 'd0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '20 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000012', 'INVOICE_SUBMITTED', 'Invoice Received', 'Rapid Repair submitted $4500 invoice.', '{}', 'd0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '10 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 'CLAIM_CLOSED', 'Claim Closed', 'Payments settled and claim closed.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'CLAIM_OPENED', 'Claim Filed', 'Fire damage reported at warehouse.', '{}', 'd0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'AI_RISK_FLAG', 'High Risk Detected', 'AI detected anomaly in damage report timeframe.', '{"riskScore":0.87}', 'd0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '6 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000008', 'SUPPLIER_FLAGGED', 'Supplier Under Review', 'Global Builders flagged for unusual estimating patterns.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'CLAIM_ASSIGNED', 'Supplier Assigned', 'Assigned to Global Builders (Override).', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'SUPPORT_TICKET', 'Support Contact', 'Customer called regarding fire claim status.', '{}', 'd0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'DOCUMENT_UPLOADED', 'Photos Uploaded', 'Site photos processed via OCR.', '{}', 'd0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'ENDORSEMENT_ADDED', 'Endorsement Added', 'Added earthquake coverage rider.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'DATA_REQUEST', 'DSAR Request', 'Subject access request received.', '{}', 'd0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000009', 'RATE_CHANGE', 'Rate Adjusted', 'Base rate increased by 2.5%.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000010', 'COMPLIANCE_REVIEW', 'Compliance Audit', 'Passed standard compliance check.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days'),
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 'SLA_BREACH', 'SLA Warning', 'Repair time exceeded 14 day rolling average.', '{}', 'd0000000-0000-0000-0000-000000000001', NOW());

-- Seed the AGE knowledge graph with relationships
-- AGE requires using the ag_catalog schema and cypher() function

LOAD 'age';
SET search_path = ag_catalog, "$user", public;

-- Create entity vertices in the graph
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-cust-102', type: 'customer', name: 'Acme Corp'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-cust-103', type: 'customer', name: 'John Doe (Redacted)'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-pol-2041', type: 'policy', name: 'Commercial Property CP-2041'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-pol-2042', type: 'policy', name: 'Auto Fleet AF-2042'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-claim-301', type: 'claim', name: 'Claim CLM-301 (Fire Damage)'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-claim-302', type: 'claim', name: 'Claim CLM-302 (Fender Bender)'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-sup-401', type: 'supplier', name: 'Rapid Repair Co.'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-sup-402', type: 'supplier', name: 'Global Builders Inc.'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-prod-501', type: 'product', name: 'Platinum Property Protector'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-prod-502', type: 'product', name: 'Fleet Guard Standard'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-txn-601', type: 'transaction', name: 'Payment Receipt CHK-992'}) $$) AS (v agtype);
SELECT * FROM cypher('context_graph', $$ CREATE (:Entity {ext_id: 'e-txn-602', type: 'transaction', name: 'Invoice INV-001'}) $$) AS (v agtype);

-- Create relationship edges (18)
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-cust-102'}), (b:Entity {ext_id: 'e-pol-2041'}) CREATE (a)-[:OWNS {confidence: 0.99}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-cust-102'}), (b:Entity {ext_id: 'e-pol-2042'}) CREATE (a)-[:OWNS {confidence: 0.99}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-pol-2041'}), (b:Entity {ext_id: 'e-prod-501'}) CREATE (a)-[:INSTANCE_OF {confidence: 1.0}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-pol-2042'}), (b:Entity {ext_id: 'e-prod-502'}) CREATE (a)-[:INSTANCE_OF {confidence: 1.0}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-claim-301'}), (b:Entity {ext_id: 'e-pol-2041'}) CREATE (a)-[:COVERED_BY {confidence: 0.98}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-claim-302'}), (b:Entity {ext_id: 'e-pol-2042'}) CREATE (a)-[:COVERED_BY {confidence: 0.98}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-cust-102'}), (b:Entity {ext_id: 'e-claim-301'}) CREATE (a)-[:FILED {confidence: 0.92}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-cust-102'}), (b:Entity {ext_id: 'e-claim-302'}) CREATE (a)-[:FILED {confidence: 0.92}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-claim-302'}), (b:Entity {ext_id: 'e-sup-401'}) CREATE (a)-[:ASSIGNED_TO {confidence: 0.95}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-claim-301'}), (b:Entity {ext_id: 'e-sup-402'}) CREATE (a)-[:ASSIGNED_TO {confidence: 0.74}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-pol-2041'}), (b:Entity {ext_id: 'e-txn-601'}) CREATE (a)-[:HAS_TRANSACTION {confidence: 0.99}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-sup-401'}), (b:Entity {ext_id: 'e-txn-602'}) CREATE (a)-[:SUBMITTED {confidence: 0.95}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-claim-302'}), (b:Entity {ext_id: 'e-txn-602'}) CREATE (a)-[:HAS_INVOICE {confidence: 0.65}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-cust-103'}), (b:Entity {ext_id: 'e-prod-502'}) CREATE (a)-[:INTERESTED_IN {confidence: 0.55}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-cust-102'}), (b:Entity {ext_id: 'e-cust-103'}) CREATE (a)-[:SUBSIDIARY_OF {confidence: 0.45}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-sup-402'}), (b:Entity {ext_id: 'e-txn-601'}) CREATE (a)-[:POTENTIAL_FRAUD_LINK {confidence: 0.35}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-prod-501'}), (b:Entity {ext_id: 'e-prod-502'}) CREATE (a)-[:SOLD_WITH {confidence: 0.85}]->(b) $$) AS (e agtype);
SELECT * FROM cypher('context_graph', $$ MATCH (a:Entity {ext_id: 'e-sup-401'}), (b:Entity {ext_id: 'e-sup-402'}) CREATE (a)-[:COMPETITOR {confidence: 0.60}]->(b) $$) AS (e agtype);
