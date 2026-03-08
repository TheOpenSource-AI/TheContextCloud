package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/contextcloud/backend/internal/model"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepo struct {
	pool *pgxpool.Pool
}

func NewPostgresRepo(pool *pgxpool.Pool) *PostgresRepo {
	return &PostgresRepo{pool: pool}
}

// ──────────────────────────────────────────
// Entity Operations
// ──────────────────────────────────────────

func (r *PostgresRepo) ListEntities(ctx context.Context, tenantID uuid.UUID, page, pageSize int) (*model.ListResponse[model.Entity], error) {
	offset := (page - 1) * pageSize

	// Count total
	var total int
	err := r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM entities WHERE tenant_id = $1", tenantID).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("count entities: %w", err)
	}

	rows, err := r.pool.Query(ctx,
		`SELECT id, tenant_id, external_id, type, name, description, attributes, 
		        confidence_score, pii_masked, data_classification, source_id, created_at, updated_at
		 FROM entities WHERE tenant_id = $1
		 ORDER BY created_at DESC
		 LIMIT $2 OFFSET $3`,
		tenantID, pageSize, offset,
	)
	if err != nil {
		return nil, fmt.Errorf("query entities: %w", err)
	}
	defer rows.Close()

	entities, err := scanEntities(rows)
	if err != nil {
		return nil, err
	}

	return &model.ListResponse[model.Entity]{
		Data:       entities,
		TotalCount: total,
		Page:       page,
		PageSize:   pageSize,
		HasMore:    offset+pageSize < total,
	}, nil
}

func (r *PostgresRepo) GetEntity(ctx context.Context, tenantID uuid.UUID, externalID string) (*model.Entity, error) {
	row := r.pool.QueryRow(ctx,
		`SELECT id, tenant_id, external_id, type, name, description, attributes,
		        confidence_score, pii_masked, data_classification, source_id, created_at, updated_at
		 FROM entities WHERE tenant_id = $1 AND external_id = $2`,
		tenantID, externalID,
	)

	var e model.Entity
	var attrs []byte
	err := row.Scan(
		&e.ID, &e.TenantID, &e.ExternalID, &e.Type, &e.Name, &e.Description,
		&attrs, &e.ConfidenceScore, &e.PIIMasked, &e.DataClassification,
		&e.SourceID, &e.CreatedAt, &e.UpdatedAt,
	)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get entity: %w", err)
	}
	_ = json.Unmarshal(attrs, &e.Attributes)
	return &e, nil
}

// ──────────────────────────────────────────
// Event Operations
// ──────────────────────────────────────────

func (r *PostgresRepo) ListEventsByEntity(ctx context.Context, entityID uuid.UUID, limit int) ([]model.Event, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, tenant_id, entity_id, type, title, description, metadata, source_id, occurred_at, created_at
		 FROM events WHERE entity_id = $1
		 ORDER BY occurred_at DESC
		 LIMIT $2`,
		entityID, limit,
	)
	if err != nil {
		return nil, fmt.Errorf("query events: %w", err)
	}
	defer rows.Close()

	var events []model.Event
	for rows.Next() {
		var ev model.Event
		var meta []byte
		if err := rows.Scan(&ev.ID, &ev.TenantID, &ev.EntityID, &ev.Type, &ev.Title,
			&ev.Description, &meta, &ev.SourceID, &ev.OccurredAt, &ev.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan event: %w", err)
		}
		_ = json.Unmarshal(meta, &ev.Metadata)
		events = append(events, ev)
	}
	return events, nil
}

// ──────────────────────────────────────────
// Graph Operations (Apache AGE via Cypher)
// ──────────────────────────────────────────

func (r *PostgresRepo) GetRelationships(ctx context.Context, externalID string, depth int) ([]model.Relationship, error) {
	if depth > 3 {
		depth = 3 // Hard limit to prevent runaway graph traversals
	}

	// AGE requires loading the extension and setting the search path per connection
	query := fmt.Sprintf(`
		LOAD 'age';
		SET search_path = ag_catalog, "$user", public;
		SELECT * FROM cypher('context_graph', $$
			MATCH (a:Entity {ext_id: '%s'})-[r]->(b:Entity)
			RETURN a.ext_id, type(r), r.confidence, b.ext_id
		$$) AS (source agtype, rel_type agtype, confidence agtype, target agtype);
	`, externalID)

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("graph query: %w", err)
	}
	defer rows.Close()

	var relationships []model.Relationship
	i := 0
	for rows.Next() {
		var source, relType, confidence, target string
		if err := rows.Scan(&source, &relType, &confidence, &target); err != nil {
			continue // Defensive: skip malformed rows
		}
		relationships = append(relationships, model.Relationship{
			ID:              fmt.Sprintf("r-%d", i),
			SourceExtID:     source,
			TargetExtID:     target,
			Type:            relType,
			ConfidenceScore: 0.9, // TODO: parse from confidence agtype
		})
		i++
	}
	return relationships, nil
}

// ──────────────────────────────────────────
// Context Payload Assembly
// ──────────────────────────────────────────

func (r *PostgresRepo) BuildContextPayload(ctx context.Context, tenantID uuid.UUID, externalID string) (*model.ContextPayload, error) {
	entity, err := r.GetEntity(ctx, tenantID, externalID)
	if err != nil || entity == nil {
		return nil, fmt.Errorf("entity not found: %s", externalID)
	}

	relationships, err := r.GetRelationships(ctx, externalID, 1)
	if err != nil {
		relationships = []model.Relationship{} // Graceful degradation
	}

	events, err := r.ListEventsByEntity(ctx, entity.ID, 20)
	if err != nil {
		events = []model.Event{} // Graceful degradation
	}

	return &model.ContextPayload{
		Entity:        *entity,
		Relationships: relationships,
		RecentEvents:  events,
		Metadata: model.PayloadMeta{
			GeneratedAt:        time.Now(),
			ContextVersion:     "1.0.0",
			TotalRelationships: len(relationships),
			TotalEvents:        len(events),
			PIIRedacted:        entity.PIIMasked,
			DepthLimit:         1,
		},
	}, nil
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

func scanEntities(rows pgx.Rows) ([]model.Entity, error) {
	var entities []model.Entity
	for rows.Next() {
		var e model.Entity
		var attrs []byte
		if err := rows.Scan(
			&e.ID, &e.TenantID, &e.ExternalID, &e.Type, &e.Name, &e.Description,
			&attrs, &e.ConfidenceScore, &e.PIIMasked, &e.DataClassification,
			&e.SourceID, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan entity: %w", err)
		}
		_ = json.Unmarshal(attrs, &e.Attributes)
		entities = append(entities, e)
	}
	return entities, nil
}
