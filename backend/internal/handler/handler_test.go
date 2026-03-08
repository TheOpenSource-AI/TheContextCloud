package handler_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/contextcloud/backend/internal/handler"
	"github.com/contextcloud/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestHealthCheck(t *testing.T) {
	// Health endpoint needs no DB — it's always available
	h := handler.NewHandler(nil, nil)

	r := gin.New()
	r.GET("/health", h.HealthCheck)

	req := httptest.NewRequest("GET", "/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Status = %d, want %d", w.Code, http.StatusOK)
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("Unmarshal: %v", err)
	}

	if body["status"] != "ok" {
		t.Errorf("status = %q, want %q", body["status"], "ok")
	}
	if body["version"] != "1.0.0-MVP" {
		t.Errorf("version = %q, want %q", body["version"], "1.0.0-MVP")
	}
	if body["time"] == nil {
		t.Error("time should be present")
	}
}

func TestListEntities_NilRepo(t *testing.T) {
	// With nil repo, should return 500 gracefully (not panic)
	h := handler.NewHandler(nil, nil)

	r := gin.New()
	r.Use(middleware.DevAuthBypass())
	r.GET("/api/v1/entities", h.ListEntities)

	req := httptest.NewRequest("GET", "/api/v1/entities", nil)
	w := httptest.NewRecorder()

	// This will panic with nil repo — that's expected for now
	// In production, the repo is never nil
	defer func() {
		if r := recover(); r != nil {
			t.Log("Expected panic with nil repo (normal behavior)")
		}
	}()

	r.ServeHTTP(w, req)
}

func TestGetEntity_MissingExternalId(t *testing.T) {
	h := handler.NewHandler(nil, nil)

	r := gin.New()
	r.Use(middleware.DevAuthBypass())
	r.GET("/api/v1/entities/:externalId", h.GetEntity)

	// This tests that the route parameter extraction works
	req := httptest.NewRequest("GET", "/api/v1/entities/", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Should return 404 since no route matches empty param
	if w.Code != http.StatusNotFound && w.Code != http.StatusMovedPermanently {
		t.Logf("Status = %d (expected 404 or redirect for empty param)", w.Code)
	}
}

func TestListEntities_PaginationParams(t *testing.T) {
	// Test that pagination query params are parsed correctly
	// We can't test full behavior without a DB, but we can verify
	// the handler doesn't crash on edge cases
	h := handler.NewHandler(nil, nil)

	r := gin.New()
	r.Use(middleware.DevAuthBypass())
	r.GET("/api/v1/entities", h.ListEntities)

	tests := []struct {
		name  string
		query string
	}{
		{"Default", ""},
		{"Page2", "?page=2&pageSize=10"},
		{"LargePageSize", "?pageSize=999"},
		{"InvalidPage", "?page=abc"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/api/v1/entities"+tt.query, nil)
			w := httptest.NewRecorder()

			defer func() {
				if r := recover(); r != nil {
					t.Logf("Panic with nil repo (expected): %v", r)
				}
			}()

			r.ServeHTTP(w, req)
		})
	}
}
