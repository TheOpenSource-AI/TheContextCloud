package model_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/contextcloud/backend/internal/model"
	"github.com/google/uuid"
)

func TestEntityType_Constants(t *testing.T) {
	tests := []struct {
		name     string
		got      model.EntityType
		expected string
	}{
		{"Customer", model.EntityCustomer, "customer"},
		{"Policy", model.EntityPolicy, "policy"},
		{"Claim", model.EntityClaim, "claim"},
		{"Supplier", model.EntitySupplier, "supplier"},
		{"Product", model.EntityProduct, "product"},
		{"Transaction", model.EntityTransaction, "transaction"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if string(tt.got) != tt.expected {
				t.Errorf("EntityType %s = %q, want %q", tt.name, tt.got, tt.expected)
			}
		})
	}
}

func TestDataClassification_Constants(t *testing.T) {
	tests := []struct {
		name     string
		got      model.DataClassification
		expected string
	}{
		{"Public", model.ClassPublic, "public"},
		{"Internal", model.ClassInternal, "internal"},
		{"Confidential", model.ClassConfidential, "confidential"},
		{"Restricted", model.ClassRestricted, "restricted"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if string(tt.got) != tt.expected {
				t.Errorf("DataClassification %s = %q, want %q", tt.name, tt.got, tt.expected)
			}
		})
	}
}

func TestEntity_JSONSerialization(t *testing.T) {
	tenantID := uuid.New()
	entityID := uuid.New()
	now := time.Now().Truncate(time.Second)

	entity := model.Entity{
		ID:                 entityID,
		TenantID:           tenantID,
		ExternalID:         "e-cust-101",
		Type:               model.EntityCustomer,
		Name:               "Acme Corp",
		Description:        "Enterprise customer",
		Attributes:         map[string]any{"industry": "insurance", "tier": "enterprise"},
		ConfidenceScore:    0.98,
		PIIMasked:          true,
		DataClassification: model.ClassConfidential,
		CreatedAt:          now,
		UpdatedAt:          now,
	}

	data, err := json.Marshal(entity)
	if err != nil {
		t.Fatalf("Marshal entity: %v", err)
	}

	var decoded model.Entity
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("Unmarshal entity: %v", err)
	}

	if decoded.ExternalID != "e-cust-101" {
		t.Errorf("ExternalID = %q, want %q", decoded.ExternalID, "e-cust-101")
	}
	if decoded.Name != "Acme Corp" {
		t.Errorf("Name = %q, want %q", decoded.Name, "Acme Corp")
	}
	if decoded.Type != model.EntityCustomer {
		t.Errorf("Type = %q, want %q", decoded.Type, model.EntityCustomer)
	}
	if decoded.ConfidenceScore != 0.98 {
		t.Errorf("ConfidenceScore = %f, want %f", decoded.ConfidenceScore, 0.98)
	}
	if !decoded.PIIMasked {
		t.Error("PIIMasked should be true")
	}
	if decoded.DataClassification != model.ClassConfidential {
		t.Errorf("DataClassification = %q, want %q", decoded.DataClassification, model.ClassConfidential)
	}
	if decoded.Attributes["industry"] != "insurance" {
		t.Errorf("Attributes[industry] = %v, want %q", decoded.Attributes["industry"], "insurance")
	}
}

func TestEntity_JSONOmitsEmptyDescription(t *testing.T) {
	entity := model.Entity{
		ID:         uuid.New(),
		TenantID:   uuid.New(),
		ExternalID: "e-test-1",
		Name:       "Test",
		Type:       model.EntityCustomer,
	}

	data, err := json.Marshal(entity)
	if err != nil {
		t.Fatalf("Marshal: %v", err)
	}

	var raw map[string]any
	_ = json.Unmarshal(data, &raw)

	if _, exists := raw["description"]; exists {
		t.Error("Empty description should be omitted from JSON")
	}
}

func TestContextPayload_JSONSerialization(t *testing.T) {
	payload := model.ContextPayload{
		Entity: model.Entity{
			ID:              uuid.New(),
			TenantID:        uuid.New(),
			ExternalID:      "e-cust-102",
			Name:            "Test Entity",
			Type:            model.EntityCustomer,
			ConfidenceScore: 0.95,
		},
		Relationships: []model.Relationship{
			{ID: "r-1", SourceExtID: "e-cust-102", TargetExtID: "e-pol-201", Type: "OWNS", ConfidenceScore: 0.92},
		},
		RecentEvents: []model.Event{},
		Metadata: model.PayloadMeta{
			GeneratedAt:        time.Now(),
			ContextVersion:     "1.0.0",
			TotalRelationships: 1,
			TotalEvents:        0,
			PIIRedacted:        false,
			DepthLimit:         1,
		},
	}

	data, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("Marshal payload: %v", err)
	}

	var decoded model.ContextPayload
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("Unmarshal payload: %v", err)
	}

	if decoded.Entity.ExternalID != "e-cust-102" {
		t.Errorf("Entity.ExternalID = %q, want %q", decoded.Entity.ExternalID, "e-cust-102")
	}
	if len(decoded.Relationships) != 1 {
		t.Errorf("Relationships count = %d, want 1", len(decoded.Relationships))
	}
	if decoded.Metadata.ContextVersion != "1.0.0" {
		t.Errorf("ContextVersion = %q, want %q", decoded.Metadata.ContextVersion, "1.0.0")
	}
	if decoded.Metadata.DepthLimit != 1 {
		t.Errorf("DepthLimit = %d, want 1", decoded.Metadata.DepthLimit)
	}
}

func TestListResponse_Generic(t *testing.T) {
	resp := model.ListResponse[model.Entity]{
		Data:       []model.Entity{{Name: "A"}, {Name: "B"}},
		TotalCount: 10,
		Page:       1,
		PageSize:   2,
		HasMore:    true,
	}

	data, err := json.Marshal(resp)
	if err != nil {
		t.Fatalf("Marshal: %v", err)
	}

	var decoded map[string]any
	_ = json.Unmarshal(data, &decoded)

	if decoded["totalCount"].(float64) != 10 {
		t.Errorf("totalCount = %v, want 10", decoded["totalCount"])
	}
	if decoded["hasMore"].(bool) != true {
		t.Error("hasMore should be true")
	}
	if len(decoded["data"].([]any)) != 2 {
		t.Errorf("data length = %d, want 2", len(decoded["data"].([]any)))
	}
}

func TestErrorResponse_JSON(t *testing.T) {
	resp := model.ErrorResponse{
		Error:   "Entity not found",
		Code:    "ENTITY_NOT_FOUND",
		Details: "No entity with ID e-cust-999",
	}

	data, _ := json.Marshal(resp)
	var decoded map[string]string
	_ = json.Unmarshal(data, &decoded)

	if decoded["error"] != "Entity not found" {
		t.Errorf("error = %q, want %q", decoded["error"], "Entity not found")
	}
	if decoded["code"] != "ENTITY_NOT_FOUND" {
		t.Errorf("code = %q, want %q", decoded["code"], "ENTITY_NOT_FOUND")
	}
}
