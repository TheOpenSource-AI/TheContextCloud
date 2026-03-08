package model

import (
	"time"

	"github.com/google/uuid"
)

// ──────────────────────────────────────────
// Core Domain Types
// ──────────────────────────────────────────

type EntityType string

const (
	EntityCustomer    EntityType = "customer"
	EntityPolicy      EntityType = "policy"
	EntityClaim       EntityType = "claim"
	EntitySupplier    EntityType = "supplier"
	EntityProduct     EntityType = "product"
	EntityTransaction EntityType = "transaction"
)

type DataClassification string

const (
	ClassPublic       DataClassification = "public"
	ClassInternal     DataClassification = "internal"
	ClassConfidential DataClassification = "confidential"
	ClassRestricted   DataClassification = "restricted"
)

type Entity struct {
	ID                 uuid.UUID          `json:"id" db:"id"`
	TenantID           uuid.UUID          `json:"tenantId" db:"tenant_id"`
	ExternalID         string             `json:"externalId" db:"external_id"`
	Type               EntityType         `json:"type" db:"type"`
	Name               string             `json:"name" db:"name"`
	Description        string             `json:"description,omitempty" db:"description"`
	Attributes         map[string]any     `json:"attributes" db:"attributes"`
	ConfidenceScore    float64            `json:"confidenceScore" db:"confidence_score"`
	PIIMasked          bool               `json:"piiMasked" db:"pii_masked"`
	DataClassification DataClassification `json:"dataClassification" db:"data_classification"`
	SourceID           *uuid.UUID         `json:"sourceId,omitempty" db:"source_id"`
	CreatedAt          time.Time          `json:"createdAt" db:"created_at"`
	UpdatedAt          time.Time          `json:"updatedAt" db:"updated_at"`
}

type Relationship struct {
	ID              string  `json:"id"`
	SourceExtID     string  `json:"sourceId"`
	TargetExtID     string  `json:"targetId"`
	Type            string  `json:"type"`
	ConfidenceScore float64 `json:"confidenceScore"`
}

type Event struct {
	ID          uuid.UUID      `json:"id" db:"id"`
	TenantID    uuid.UUID      `json:"tenantId" db:"tenant_id"`
	EntityID    uuid.UUID      `json:"entityId" db:"entity_id"`
	Type        string         `json:"type" db:"type"`
	Title       string         `json:"title" db:"title"`
	Description string         `json:"description,omitempty" db:"description"`
	Metadata    map[string]any `json:"metadata,omitempty" db:"metadata"`
	SourceID    *uuid.UUID     `json:"sourceId,omitempty" db:"source_id"`
	OccurredAt  time.Time      `json:"occurredAt" db:"occurred_at"`
	CreatedAt   time.Time      `json:"createdAt" db:"created_at"`
}

type DataSource struct {
	ID              uuid.UUID      `json:"id" db:"id"`
	TenantID        uuid.UUID      `json:"tenantId" db:"tenant_id"`
	Name            string         `json:"name" db:"name"`
	Type            string         `json:"type" db:"type"`
	Config          map[string]any `json:"config,omitempty" db:"config"`
	ConfidenceScore float64        `json:"confidenceScore" db:"confidence_score"`
	CreatedAt       time.Time      `json:"createdAt" db:"created_at"`
}

type IngestionJob struct {
	ID                    uuid.UUID  `json:"id" db:"id"`
	TenantID              uuid.UUID  `json:"tenantId" db:"tenant_id"`
	SourceID              *uuid.UUID `json:"sourceId,omitempty" db:"source_id"`
	Status                string     `json:"status" db:"status"`
	FileKey               string     `json:"fileKey,omitempty" db:"file_key"`
	EntitiesCreated       int        `json:"entitiesCreated" db:"entities_created"`
	RelationshipsCreated  int        `json:"relationshipsCreated" db:"relationships_created"`
	EventsCreated         int        `json:"eventsCreated" db:"events_created"`
	ErrorMessage          string     `json:"errorMessage,omitempty" db:"error_message"`
	StartedAt             *time.Time `json:"startedAt,omitempty" db:"started_at"`
	CompletedAt           *time.Time `json:"completedAt,omitempty" db:"completed_at"`
	CreatedAt             time.Time  `json:"createdAt" db:"created_at"`
}

// ──────────────────────────────────────────
// Agent-Optimized Context Payload
// ──────────────────────────────────────────

type ContextPayload struct {
	Entity        Entity         `json:"entity"`
	Relationships []Relationship `json:"relationships"`
	RecentEvents  []Event        `json:"recentEvents"`
	Metadata      PayloadMeta    `json:"metadata"`
}

type PayloadMeta struct {
	GeneratedAt        time.Time `json:"generatedAt"`
	ContextVersion     string    `json:"contextVersion"`
	TotalRelationships int       `json:"totalRelationships"`
	TotalEvents        int       `json:"totalEvents"`
	PIIRedacted        bool      `json:"piiRedacted"`
	DepthLimit         int       `json:"depthLimit"`
}

// ──────────────────────────────────────────
// API Response Wrappers
// ──────────────────────────────────────────

type ListResponse[T any] struct {
	Data       []T  `json:"data"`
	TotalCount int  `json:"totalCount"`
	Page       int  `json:"page"`
	PageSize   int  `json:"pageSize"`
	HasMore    bool `json:"hasMore"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}
