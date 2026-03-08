import { z } from "zod";

// Base Identifier Schema
export const IdSchema = z.string().uuid();

// Source System Schema
export const SourceSystemSchema = z.object({
    id: IdSchema.optional(),
    name: z.string(),
    type: z.enum(["database", "csv", "api", "document", "manual"]),
    confidenceScore: z.number().min(0).max(1),
    lineageUrl: z.string().url().optional(),
});
export type SourceSystem = z.infer<typeof SourceSystemSchema>;

// Entity Type Enum
export const EntityTypeEnum = z.enum(["customer", "policy", "claim", "supplier", "product", "transaction"]);

// Entity Schema
export const EntitySchema = z.object({
    id: IdSchema,
    type: EntityTypeEnum,
    name: z.string(),
    description: z.string().optional(),
    attributes: z.record(z.string(), z.unknown()),
    sourceSystems: z.array(SourceSystemSchema),
    confidenceScore: z.number().min(0).max(1),
    piiMasked: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export type Entity = z.infer<typeof EntitySchema>;

// Relationship Schema
export const RelationshipSchema = z.object({
    id: IdSchema,
    sourceId: IdSchema,
    targetId: IdSchema,
    type: z.string(),
    description: z.string().optional(),
    confidenceScore: z.number().min(0).max(1),
    sourceSystems: z.array(SourceSystemSchema).optional(),
    createdAt: z.string().datetime(),
});
export type Relationship = z.infer<typeof RelationshipSchema>;

// Event Schema
export const EventSchema = z.object({
    id: IdSchema,
    entityId: IdSchema,
    type: z.string(),
    title: z.string(),
    description: z.string(),
    timestamp: z.string().datetime(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    sourceSystem: SourceSystemSchema.optional(),
});
export type Event = z.infer<typeof EventSchema>;

// High-Density Context Payload for Agent Consumption
export const AgentContextPayloadSchema = z.object({
    entity: EntitySchema,
    relationships: z.array(RelationshipSchema),
    recentEvents: z.array(EventSchema),
    metadata: z.object({
        generatedAt: z.string().datetime(),
        confidenceSummary: z.object({
            overall: z.number().min(0).max(1),
            isVerifiable: z.boolean(),
        }),
        dataClassification: z.string().default("Confidential"),
        piiRedacted: z.boolean().default(true),
    }),
});
export type AgentContextPayload = z.infer<typeof AgentContextPayloadSchema>;
