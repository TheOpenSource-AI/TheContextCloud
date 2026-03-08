import { Entity, Relationship, Event, SourceSystem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const now = new Date().toISOString();
const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_SOURCES: Record<string, SourceSystem> = {
    CORE_SUITE: {
        id: uuidv4(),
        name: "CoreSuite V4",
        type: "database",
        confidenceScore: 0.99,
    },
    LEGACY_CLAIMS: {
        id: uuidv4(),
        name: "Legacy Claims DB",
        type: "database",
        confidenceScore: 0.85,
    },
    CRM: {
        id: uuidv4(),
        name: "Salesforce CRM",
        type: "api",
        confidenceScore: 0.95,
    },
    OCR_EXTRACT: {
        id: uuidv4(),
        name: "Document OCR Pipeline",
        type: "document",
        confidenceScore: 0.65,
    }
};

// 12 Entities
export const MOCK_ENTITIES: Entity[] = [
    {
        id: "e-cust-102",
        type: "customer",
        name: "Acme Corp",
        description: "Enterprise manufacturing client",
        attributes: { industry: "Manufacturing", riskTier: "Medium", annualRevenue: "$50M" },
        sourceSystems: [MOCK_SOURCES.CRM],
        confidenceScore: 0.98,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-cust-103",
        type: "customer",
        name: "John Doe (Redacted)",
        description: "Retail policy holder",
        attributes: { age: "Confidential", location: "New York" },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 0.99,
        piiMasked: true,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-pol-2041",
        type: "policy",
        name: "Commercial Property CP-2041",
        description: "Coverage for main manufacturing facility",
        attributes: { status: "Active", premium: 12000, limit: 5000000 },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 0.99,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-pol-2042",
        type: "policy",
        name: "Auto Fleet AF-2042",
        description: "Coverage for 50 delivery vehicles",
        attributes: { status: "Active", premium: 8000, limit: 2000000 },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 0.99,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-claim-301",
        type: "claim",
        name: "Claim CLM-301 (Fire Damage)",
        description: "Small fire in warehouse sector B",
        attributes: { status: "Open", estimatedLoss: 25000, dateOfLoss: lastWeek },
        sourceSystems: [MOCK_SOURCES.LEGACY_CLAIMS],
        confidenceScore: 0.88,
        piiMasked: false,
        createdAt: lastWeek,
        updatedAt: now,
    },
    {
        id: "e-claim-302",
        type: "claim",
        name: "Claim CLM-302 (Fender Bender)",
        description: "Delivery truck rear-ended",
        attributes: { status: "Closed", estimatedLoss: 4500, dateOfLoss: lastMonth },
        sourceSystems: [MOCK_SOURCES.LEGACY_CLAIMS, MOCK_SOURCES.OCR_EXTRACT],
        confidenceScore: 0.92,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-sup-401",
        type: "supplier",
        name: "Rapid Repair Co.",
        description: "Preferred auto repair network",
        attributes: { status: "Approved", rating: 4.8 },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 0.95,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-sup-402",
        type: "supplier",
        name: "Global Builders Inc.",
        description: "Commercial property restoration",
        attributes: { status: "Under Review", rating: 3.2, riskFlag: true },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE, MOCK_SOURCES.OCR_EXTRACT],
        confidenceScore: 0.72,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-prod-501",
        type: "product",
        name: "Platinum Property Protector",
        description: "Flagship commercial property insurance product",
        attributes: { category: "Property", lineOfBusiness: "Commercial" },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 1.0,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-prod-502",
        type: "product",
        name: "Fleet Guard Standard",
        description: "Standard commercial auto fleet product",
        attributes: { category: "Auto", lineOfBusiness: "Commercial" },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 1.0,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-doc-601",
        type: "transaction",
        name: "Payment Receipt CHK-992",
        description: "Premium payment for CP-2041",
        attributes: { amount: 12000, method: "Wire Transfer", status: "Cleared" },
        sourceSystems: [MOCK_SOURCES.CORE_SUITE],
        confidenceScore: 0.99,
        piiMasked: false,
        createdAt: lastMonth,
        updatedAt: now,
    },
    {
        id: "e-doc-602",
        type: "transaction",
        name: "Invoice INV-001 (Rapid Repair)",
        description: "Repair invoice for vehicle 12",
        attributes: { amount: 4500, status: "Paid" },
        sourceSystems: [MOCK_SOURCES.OCR_EXTRACT],
        confidenceScore: 0.68, // Lower score due to OCR
        piiMasked: false,
        createdAt: now,
        updatedAt: now,
    }
];

// Relationships (18)
export const MOCK_RELATIONSHIPS: Relationship[] = [
    // Customer <-> Policy
    { id: uuidv4(), sourceId: "e-cust-102", targetId: "e-pol-2041", type: "OWNS", confidenceScore: 0.99, createdAt: lastMonth },
    { id: uuidv4(), sourceId: "e-cust-102", targetId: "e-pol-2042", type: "OWNS", confidenceScore: 0.99, createdAt: lastMonth },

    // Policy <-> Product
    { id: uuidv4(), sourceId: "e-pol-2041", targetId: "e-prod-501", type: "INSTANCE_OF", confidenceScore: 1.0, createdAt: lastMonth },
    { id: uuidv4(), sourceId: "e-pol-2042", targetId: "e-prod-502", type: "INSTANCE_OF", confidenceScore: 1.0, createdAt: lastMonth },

    // Policy <-> Claim
    { id: uuidv4(), sourceId: "e-claim-301", targetId: "e-pol-2041", type: "COVERED_BY", confidenceScore: 0.98, createdAt: lastWeek },
    { id: uuidv4(), sourceId: "e-claim-302", targetId: "e-pol-2042", type: "COVERED_BY", confidenceScore: 0.98, createdAt: lastMonth },

    // Customer <-> Claim (Inferred)
    { id: uuidv4(), sourceId: "e-cust-102", targetId: "e-claim-301", type: "FILED", confidenceScore: 0.92, createdAt: lastWeek, sourceSystems: [MOCK_SOURCES.CRM] },
    { id: uuidv4(), sourceId: "e-cust-102", targetId: "e-claim-302", type: "FILED", confidenceScore: 0.92, createdAt: lastMonth },

    // Claim <-> Supplier
    { id: uuidv4(), sourceId: "e-claim-302", targetId: "e-sup-401", type: "ASSIGNED_TO", confidenceScore: 0.95, createdAt: lastMonth },
    { id: uuidv4(), sourceId: "e-claim-301", targetId: "e-sup-402", type: "ASSIGNED_TO", confidenceScore: 0.74, createdAt: lastWeek, sourceSystems: [MOCK_SOURCES.OCR_EXTRACT] }, // Lower confidence assigned link

    // Interactions & Artifacts
    { id: uuidv4(), sourceId: "e-pol-2041", targetId: "e-doc-601", type: "HAS_TRANSACTION", confidenceScore: 0.99, createdAt: lastMonth },
    { id: uuidv4(), sourceId: "e-sup-401", targetId: "e-doc-602", type: "SUBMITTED", confidenceScore: 0.95, createdAt: now },
    { id: uuidv4(), sourceId: "e-claim-302", targetId: "e-doc-602", type: "HAS_INVOICE", confidenceScore: 0.65, createdAt: now, sourceSystems: [MOCK_SOURCES.OCR_EXTRACT] }, // AI inferred link

    // Customer 2 relationships
    { id: uuidv4(), sourceId: "e-cust-103", targetId: "e-prod-502", type: "INTERESTED_IN", confidenceScore: 0.55, createdAt: now, sourceSystems: [MOCK_SOURCES.CRM] }, // AI inferred link
    { id: uuidv4(), sourceId: "e-cust-102", targetId: "e-cust-103", type: "SUBSIDIARY_OF", confidenceScore: 0.45, createdAt: now }, // Low confidence AI link

    // Extra links just to bulk up graph
    { id: uuidv4(), sourceId: "e-sup-402", targetId: "e-doc-601", type: "POTENTIAL_FRAUD_LINK", confidenceScore: 0.35, createdAt: now }, // Very low confidence edge case
    { id: uuidv4(), sourceId: "e-prod-501", targetId: "e-prod-502", type: "SOLD_WITH", confidenceScore: 0.85, createdAt: lastMonth },
    { id: uuidv4(), sourceId: "e-sup-401", targetId: "e-sup-402", type: "COMPETITOR", confidenceScore: 0.60, createdAt: lastMonth }
];

// Events (20)
export const MOCK_EVENTS: Event[] = [
    { id: uuidv4(), entityId: "e-cust-102", type: "CUSTOMER_ONBOARDED", title: "Customer Onboarded", description: "Acme Corp account created.", timestamp: lastMonth, sourceSystem: MOCK_SOURCES.CRM },
    { id: uuidv4(), entityId: "e-pol-2041", type: "POLICY_ISSUED", title: "Policy Issued", description: "CP-2041 activated.", timestamp: lastMonth, sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-pol-2042", type: "POLICY_ISSUED", title: "Policy Issued", description: "AF-2042 activated.", timestamp: lastMonth, sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-doc-601", type: "PAYMENT_RECEIVED", title: "Payment Cleared", description: "Initial premium of $12,000 cleared.", timestamp: lastMonth, sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-claim-302", type: "CLAIM_OPENED", title: "Claim Filed", description: "First notice of loss for vehicle accident.", timestamp: lastMonth, sourceSystem: MOCK_SOURCES.LEGACY_CLAIMS },
    { id: uuidv4(), entityId: "e-claim-302", type: "CLAIM_ASSIGNED", title: "Supplier Assigned", description: "Assigned to Rapid Repair Co.", timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-claim-302", type: "INSPECTION_COMPLETED", title: "Inspection Passed", description: "Vehicle inspected by shop.", timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.LEGACY_CLAIMS },
    { id: uuidv4(), entityId: "e-doc-602", type: "INVOICE_SUBMITTED", title: "Invoice Received", description: "Rapid Repair submitted $4500 invoice.", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.OCR_EXTRACT },
    { id: uuidv4(), entityId: "e-claim-302", type: "CLAIM_CLOSED", title: "Claim Closed", description: "Payments settled and claim closed.", timestamp: lastWeek, sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-claim-301", type: "CLAIM_OPENED", title: "Claim Filed", description: "Fire damage reported at warehouse.", timestamp: lastWeek, sourceSystem: MOCK_SOURCES.LEGACY_CLAIMS },
    { id: uuidv4(), entityId: "e-claim-301", type: "AI_RISK_FLAG", title: "High Risk Detected", description: "AI detected anomaly in damage report timeframe.", timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.OCR_EXTRACT },
    { id: uuidv4(), entityId: "e-sup-402", type: "SUPPLIER_FLAGGED", title: "Supplier Under Review", description: "Global Builders flagged for unusual estimating patterns.", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-claim-301", type: "CLAIM_ASSIGNED", title: "Supplier Assigned", description: "Assigned to Global Builders (Override).", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-cust-102", type: "SUPPORT_TICKET", title: "Support Contact", description: "Customer called regarding fire claim status.", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.CRM },
    { id: uuidv4(), entityId: "e-claim-301", type: "DOCUMENT_UPLOADED", title: "Photos Uploaded", description: "Site photos processed via OCR.", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.OCR_EXTRACT },
    // Adding a few more to hit 20
    { id: uuidv4(), entityId: "e-pol-2041", type: "ENDORSEMENT_ADDED", title: "Endorsement Added", description: "Added earthquake coverage rider.", timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-cust-103", type: "DATA_REQUEST", title: "DSAR Request", description: "Subject access request received.", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), sourceSystem: MOCK_SOURCES.CRM },
    { id: uuidv4(), entityId: "e-prod-501", type: "RATE_CHANGE", title: "Rate Adjusted", description: "Base rate increased by 2.5%.", timestamp: lastWeek, sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-prod-502", type: "COMPLIANCE_REVIEW", title: "Compliance Audit", description: "Passed standard compliance check.", timestamp: lastMonth, sourceSystem: MOCK_SOURCES.CORE_SUITE },
    { id: uuidv4(), entityId: "e-sup-401", type: "SLA_BREACH", title: "SLA Warning", description: "Repair time exceeded 14 day rolling average.", timestamp: now, sourceSystem: MOCK_SOURCES.CORE_SUITE },
];
