package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/contextcloud/backend/internal/middleware"
	"github.com/contextcloud/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)

type IngestionHandler struct {
	store      *repository.MinioStore
	kafkaWriter *kafka.Writer
}

type IngestionMessage struct {
	JobID    string `json:"jobId"`
	TenantID string `json:"tenantId"`
	FileKey  string `json:"fileKey"`
	SourceID string `json:"sourceId"`
}

func NewIngestionHandler(store *repository.MinioStore, kafkaBroker string) *IngestionHandler {
	w := &kafka.Writer{
		Addr:     kafka.TCP(kafkaBroker),
		Topic:    "ingestion-jobs",
		Balancer: &kafka.LeastBytes{},
	}
	return &IngestionHandler{store: store, kafkaWriter: w}
}

// POST /api/v1/ingest/upload
// Accepts a file upload, stores it in MinIO, and queues a Kafka message.
func (h *IngestionHandler) UploadFile(c *gin.Context) {
	tenantID := middleware.GetTenantID(c)

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File required", "code": "FILE_MISSING"})
		return
	}
	defer file.Close()

	// Validate file type
	contentType := header.Header.Get("Content-Type")
	if contentType != "text/csv" && contentType != "application/octet-stream" {
		// Allow through — many CSVs come as octet-stream
	}

	// Generate unique file key
	jobID := uuid.New()
	fileKey := fmt.Sprintf("uploads/%s/%s/%s", tenantID, jobID, header.Filename)

	// Upload to MinIO
	if err := h.store.Upload(c.Request.Context(), fileKey, file, header.Size, contentType); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store file"})
		return
	}

	// Publish ingestion job to Kafka
	msg := IngestionMessage{
		JobID:    jobID.String(),
		TenantID: tenantID.String(),
		FileKey:  fileKey,
	}
	msgBytes, _ := json.Marshal(msg)

	err = h.kafkaWriter.WriteMessages(c.Request.Context(), kafka.Message{
		Key:   []byte(jobID.String()),
		Value: msgBytes,
		Time:  time.Now(),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to queue ingestion job"})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"jobId":   jobID,
		"status":  "pending",
		"fileKey": fileKey,
		"message": "Ingestion job queued successfully",
	})
}
