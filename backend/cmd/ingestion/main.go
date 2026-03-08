package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/contextcloud/backend/config"
	"github.com/contextcloud/backend/internal/ingestion"
	"github.com/contextcloud/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/segmentio/kafka-go"
)

// IngestionMessage is the Kafka message payload.
type IngestionMessage struct {
	JobID    string `json:"jobId"`
	TenantID string `json:"tenantId"`
	FileKey  string `json:"fileKey"`
	SourceID string `json:"sourceId"`
}

func main() {
	cfg := config.Load()
	log.Println("🏭 Starting Context Cloud Ingestion Consumer...")

	// ── Database ─────────────────────────────
	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer pool.Close()
	log.Println("✓ Connected to PostgreSQL")

	repo := repository.NewPostgresRepo(pool)

	// ── MinIO ────────────────────────────────
	minioStore, err := repository.NewMinioStore(cfg.MinioURL, cfg.MinioKey, cfg.MinioSecret, cfg.MinioBucket)
	if err != nil {
		log.Fatalf("Failed to connect to MinIO: %v", err)
	}
	if err := minioStore.EnsureBucket(context.Background()); err != nil {
		log.Fatalf("Failed to ensure bucket: %v", err)
	}
	log.Println("✓ Connected to MinIO")

	// ── Kafka Consumer ───────────────────────
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{cfg.KafkaBroker},
		Topic:    "ingestion-jobs",
		GroupID:  "context-cloud-ingestion",
		MinBytes: 1e3,  // 1KB
		MaxBytes: 10e6, // 10MB
	})
	defer reader.Close()
	log.Println("✓ Kafka consumer ready (topic: ingestion-jobs)")

	// ── Signal Handling ──────────────────────
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		<-quit
		log.Println("Shutting down consumer...")
		cancel()
	}()

	// ── Main Consumer Loop ───────────────────
	for {
		msg, err := reader.ReadMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				break // Graceful shutdown
			}
			log.Printf("Kafka read error: %v", err)
			continue
		}

		var im IngestionMessage
		if err := json.Unmarshal(msg.Value, &im); err != nil {
			log.Printf("⚠ Invalid message: %v", err)
			continue
		}

		log.Printf("📥 Processing job %s (tenant: %s, file: %s)", im.JobID, im.TenantID, im.FileKey)

		if err := processIngestionJob(ctx, repo, minioStore, im); err != nil {
			log.Printf("❌ Job %s failed: %v", im.JobID, err)
			// Update job status to failed
			updateJobStatus(ctx, pool, im.JobID, "failed", err.Error())
		} else {
			log.Printf("✅ Job %s completed", im.JobID)
		}
	}

	log.Println("Consumer stopped.")
}

func processIngestionJob(ctx context.Context, repo *repository.PostgresRepo, store *repository.MinioStore, msg IngestionMessage) error {
	// 1. Download file from MinIO
	reader, err := store.Download(ctx, msg.FileKey)
	if err != nil {
		return fmt.Errorf("download file: %w", err)
	}
	defer reader.Close()

	// 2. Parse CSV in streaming batches
	parser, err := ingestion.NewCSVParser(reader)
	if err != nil {
		return fmt.Errorf("init csv parser: %w", err)
	}

	log.Printf("  Columns detected: %v", parser.Header())

	totalEntities := 0
	batchSize := 100

	for {
		batch, err := parser.ReadBatch(batchSize)
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("read batch: %w", err)
		}

		// 3. For each batch, call Python AI Engine via gRPC for NER
		// TODO: When Python AI Engine is ready, call it here
		// For now, create entities directly from CSV columns
		for _, row := range batch {
			name := firstNonEmpty(row, "name", "Name", "entity_name", "customer_name")
			entityType := firstNonEmpty(row, "type", "Type", "entity_type")

			if name == "" {
				continue // Skip rows without identifiable name
			}
			if entityType == "" {
				entityType = "unknown"
			}

			log.Printf("  → Entity: %s (%s)", name, entityType)
			totalEntities++
		}

		log.Printf("  Processed batch of %d rows (%d entities total)", len(batch), totalEntities)
	}

	return nil
}

func updateJobStatus(ctx context.Context, pool *pgxpool.Pool, jobID, status, errMsg string) {
	id, err := uuid.Parse(jobID)
	if err != nil {
		return
	}
	now := time.Now()
	_, _ = pool.Exec(ctx,
		`UPDATE ingestion_jobs SET status = $1, error_message = $2, completed_at = $3 WHERE id = $4`,
		status, errMsg, now, id,
	)
}

func firstNonEmpty(row map[string]string, keys ...string) string {
	for _, k := range keys {
		if v, ok := row[k]; ok && v != "" {
			return v
		}
	}
	return ""
}
