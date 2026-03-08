import { Entity, Relationship, Event, AgentContextPayload } from '../types';
import { MOCK_ENTITIES, MOCK_RELATIONSHIPS, MOCK_EVENTS } from '../mock-data/insurance-seed';

/**
 * Artificial Latency (Jitter) Simulation
 * Proves the UI resiliency against network latency.
 */
const jitter = async (minMs = 200, maxMs = 800) => {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
    return new Promise((resolve) => setTimeout(resolve, delay));
};

export const MemoryStore = {
    async getEntities(query?: string): Promise<Entity[]> {
        await jitter(300, 700);
        if (!query) return MOCK_ENTITIES;
        const lowerQuery = query.toLowerCase();
        return MOCK_ENTITIES.filter(e =>
            e.name.toLowerCase().includes(lowerQuery) ||
            e.type.toLowerCase().includes(lowerQuery)
        );
    },

    async getEntity(id: string): Promise<Entity | null> {
        await jitter(100, 400);
        return MOCK_ENTITIES.find(e => e.id === id) || null;
    },

    async getRelationships(entityId?: string): Promise<Relationship[]> {
        await jitter(200, 600);
        if (!entityId) return MOCK_RELATIONSHIPS;
        return MOCK_RELATIONSHIPS.filter(r => r.sourceId === entityId || r.targetId === entityId);
    },

    async getEvents(entityId?: string): Promise<Event[]> {
        await jitter(150, 500);
        if (!entityId) return MOCK_EVENTS;
        return MOCK_EVENTS.filter(ev => ev.entityId === entityId).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    },

    /**
     * The Agent-Optimized Payload Endpoint
     * Returns a flattened, highly dense context payload simulating LLM context window optimization.
     */
    async getContextPayload(entityId: string): Promise<AgentContextPayload | null> {
        await jitter(600, 1200); // Context generation takes longer

        const entity = await this.getEntity(entityId);
        if (!entity) return null;

        const relationships = await this.getRelationships(entityId);
        const recentEvents = await this.getEvents(entityId);

        // Calculate aggregate confidence simulating an AI check
        const avgConfidence = relationships.reduce((acc, r) => acc + r.confidenceScore, entity.confidenceScore) / (relationships.length + 1);

        return {
            entity,
            relationships,
            recentEvents: recentEvents.slice(0, 10), // Limit to top 10 most recent for token efficiency
            metadata: {
                generatedAt: new Date().toISOString(),
                confidenceSummary: {
                    overall: Number(avgConfidence.toFixed(2)),
                    isVerifiable: avgConfidence > 0.75,
                },
                dataClassification: "Confidential",
                piiRedacted: true, // Emphasize Enterprise Governance
            }
        };
    }
};
