package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/contextcloud/backend/config"
	"github.com/contextcloud/backend/internal/handler"
	"github.com/contextcloud/backend/internal/middleware"
	"github.com/contextcloud/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

func main() {
	cfg := config.Load()

	// ── Database Pool ────────────────────────
	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(context.Background()); err != nil {
		log.Fatalf("PostgreSQL ping failed: %v", err)
	}
	log.Println("✓ Connected to PostgreSQL")

	// ── Redis ────────────────────────────────
	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.RedisURL,
	})
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Printf("⚠ Redis not available (rate limiting disabled): %v", err)
	} else {
		log.Println("✓ Connected to Redis")
	}

	// ── Repositories ─────────────────────────
	repo := repository.NewPostgresRepo(pool)
	cache := repository.NewRedisCache(rdb)
	h := handler.NewHandler(repo, cache)

	// ── Gin Router ───────────────────────────
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(corsMiddleware())

	// Public routes
	r.GET("/health", h.HealthCheck)

	// API v1 — authenticated
	v1 := r.Group("/api/v1")
	v1.Use(middleware.DevAuthBypass()) // Swap with AuthMiddleware(cfg) in production
	v1.Use(middleware.RateLimitMiddleware(cache, 120))
	{
		v1.GET("/entities", h.ListEntities)
		v1.GET("/entities/:externalId", h.GetEntity)
		v1.GET("/entities/:externalId/events", h.ListEntityEvents)
		v1.GET("/entities/:externalId/relationships", h.GetRelationships)
		v1.GET("/context/:externalId", h.GetContextPayload)
	}

	// ── Graceful Shutdown ────────────────────
	srv := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("🚀 Context Cloud API Gateway running on :%s", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Forced shutdown: %v", err)
	}
	log.Println("Server stopped.")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Tenant-ID")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
