/**
 * Context Cloud API Client
 * 
 * Abstracts all calls to the Go API Gateway.
 * Falls back to the local memoryStore when the API is unavailable (dev mode).
 */

import { Entity, Relationship, Event, AgentContextPayload } from "@/lib/types";
import { MemoryStore } from "@/lib/repository/memoryStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ListResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

/**
 * Fetches with automatic fallback to the mock memoryStore.
 * This ensures the frontend works both with and without the Go backend running.
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            // Short timeout so fallback triggers quickly in dev
            signal: AbortSignal.timeout(3000),
        });

        if (!res.ok) {
            console.warn(`API ${path} returned ${res.status}`);
            return null;
        }

        return (await res.json()) as T;
    } catch (err) {
        // API unreachable — fall back to mock store
        console.info(`[Context Cloud] API unavailable at ${API_BASE}, using mock data`);
        return null;
    }
}

// ──────────────────────────────────────────
// Entity Operations
// ──────────────────────────────────────────

export async function getEntities(page = 1, pageSize = 20): Promise<Entity[]> {
    const result = await apiFetch<ListResponse<Entity>>(`/api/v1/entities?page=${page}&pageSize=${pageSize}`);
    if (result?.data) return result.data;

    // Fallback to mock
    return MemoryStore.getEntities();
}

export async function getEntity(externalId: string): Promise<Entity | null> {
    const result = await apiFetch<Entity>(`/api/v1/entities/${externalId}`);
    if (result) return result;

    // Fallback
    const all = await MemoryStore.getEntities();
    return all.find(e => e.id === externalId) ?? null;
}

// ──────────────────────────────────────────
// Relationship Operations
// ──────────────────────────────────────────

export async function getRelationships(externalId?: string): Promise<Relationship[]> {
    if (externalId) {
        const result = await apiFetch<{ data: Relationship[] }>(`/api/v1/entities/${externalId}/relationships`);
        if (result?.data) return result.data;
    }

    return MemoryStore.getRelationships();
}

// ──────────────────────────────────────────
// Event Operations
// ──────────────────────────────────────────

export async function getEvents(externalId?: string): Promise<Event[]> {
    if (externalId) {
        const result = await apiFetch<{ data: Event[] }>(`/api/v1/entities/${externalId}/events`);
        if (result?.data) return result.data;
    }

    return MemoryStore.getEvents();
}

// ──────────────────────────────────────────
// Agent Context Payload 
// ──────────────────────────────────────────

export async function getContextPayload(externalId: string): Promise<AgentContextPayload | null> {
    const result = await apiFetch<AgentContextPayload>(`/api/v1/context/${externalId}`);
    if (result) return result;

    return MemoryStore.getContextPayload(externalId);
}

// ──────────────────────────────────────────
// Ingestion
// ──────────────────────────────────────────

export async function uploadFile(file: File): Promise<{ jobId: string; status: string } | null> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/api/v1/ingest/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) return null;
        return await res.json();
    } catch {
        console.info("[Context Cloud] Upload API unavailable");
        return null;
    }
}

// ──────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string; version: string } | null> {
    return apiFetch<{ status: string; version: string }>("/health");
}
