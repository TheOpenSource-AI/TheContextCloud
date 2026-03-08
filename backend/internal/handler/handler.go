package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/contextcloud/backend/internal/middleware"
	"github.com/contextcloud/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo  *repository.PostgresRepo
	cache *repository.RedisCache
}

func NewHandler(repo *repository.PostgresRepo, cache *repository.RedisCache) *Handler {
	return &Handler{repo: repo, cache: cache}
}

// ──────────────────────────────────────────
// GET /api/v1/entities
// ──────────────────────────────────────────
func (h *Handler) ListEntities(c *gin.Context) {
	tenantID := middleware.GetTenantID(c)
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))

	if pageSize > 100 {
		pageSize = 100 // Hard cap
	}

	result, err := h.repo.ListEntities(c.Request.Context(), tenantID, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list entities"})
		return
	}

	c.JSON(http.StatusOK, result)
}

// ──────────────────────────────────────────
// GET /api/v1/entities/:externalId
// ──────────────────────────────────────────
func (h *Handler) GetEntity(c *gin.Context) {
	tenantID := middleware.GetTenantID(c)
	externalID := c.Param("externalId")

	entity, err := h.repo.GetEntity(c.Request.Context(), tenantID, externalID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get entity"})
		return
	}
	if entity == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entity not found", "code": "ENTITY_NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, entity)
}

// ──────────────────────────────────────────
// GET /api/v1/entities/:externalId/events
// ──────────────────────────────────────────
func (h *Handler) ListEntityEvents(c *gin.Context) {
	tenantID := middleware.GetTenantID(c)
	externalID := c.Param("externalId")

	entity, err := h.repo.GetEntity(c.Request.Context(), tenantID, externalID)
	if err != nil || entity == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entity not found"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if limit > 100 {
		limit = 100
	}

	events, err := h.repo.ListEventsByEntity(c.Request.Context(), entity.ID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list events"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": events, "totalCount": len(events)})
}

// ──────────────────────────────────────────
// GET /api/v1/entities/:externalId/relationships
// ──────────────────────────────────────────
func (h *Handler) GetRelationships(c *gin.Context) {
	externalID := c.Param("externalId")
	depth, _ := strconv.Atoi(c.DefaultQuery("depth", "1"))

	relationships, err := h.repo.GetRelationships(c.Request.Context(), externalID, depth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query graph"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": relationships, "totalCount": len(relationships)})
}

// ──────────────────────────────────────────
// GET /api/v1/context/:externalId
// Agent-Optimized Context Payload
// ──────────────────────────────────────────
func (h *Handler) GetContextPayload(c *gin.Context) {
	tenantID := middleware.GetTenantID(c)
	externalID := c.Param("externalId")

	// Check Redis cache first
	cacheKey := "context:" + tenantID.String() + ":" + externalID
	cached, _ := h.cache.Get(c.Request.Context(), cacheKey)
	if cached != nil {
		c.Header("X-Cache", "HIT")
		c.Header("X-Agent-Optimized", "true")
		c.Data(http.StatusOK, "application/json", cached)
		return
	}

	payload, err := h.repo.BuildContextPayload(c.Request.Context(), tenantID, externalID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error(), "code": "CONTEXT_NOT_FOUND"})
		return
	}

	// Cache for 5 minutes
	_ = h.cache.Set(c.Request.Context(), cacheKey, payload, 5*time.Minute)

	c.Header("X-Cache", "MISS")
	c.Header("X-Agent-Optimized", "true")
	c.Header("X-Context-Cloud-Version", "1.0.0")
	c.JSON(http.StatusOK, payload)
}

// ──────────────────────────────────────────
// GET /api/v1/health
// ──────────────────────────────────────────
func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"version": "1.0.0-MVP",
		"time":    time.Now().UTC(),
	})
}

// Suppress unused import
var _ = json.Marshal
