package config_test

import (
	"os"
	"testing"

	"github.com/contextcloud/backend/config"
)

func TestLoad_Defaults(t *testing.T) {
	// Clear any env vars that might be set
	envVars := []string{"PORT", "DATABASE_URL", "REDIS_URL", "MINIO_URL",
		"MINIO_ACCESS_KEY", "MINIO_SECRET_KEY", "MINIO_BUCKET",
		"KAFKA_BROKER", "JWT_SECRET", "AI_ENGINE_URL"}
	for _, v := range envVars {
		os.Unsetenv(v)
	}

	cfg := config.Load()

	tests := []struct {
		name     string
		got      string
		expected string
	}{
		{"ServerPort", cfg.ServerPort, "8080"},
		{"DatabaseURL", cfg.DatabaseURL, "postgres://cc_admin:cc_dev_password@localhost:5432/contextcloud?sslmode=disable"},
		{"RedisURL", cfg.RedisURL, "localhost:6379"},
		{"MinioURL", cfg.MinioURL, "localhost:9000"},
		{"MinioKey", cfg.MinioKey, "minioadmin"},
		{"MinioSecret", cfg.MinioSecret, "minioadmin"},
		{"MinioBucket", cfg.MinioBucket, "context-cloud-uploads"},
		{"KafkaBroker", cfg.KafkaBroker, "localhost:9092"},
		{"JWTSecret", cfg.JWTSecret, "dev-secret-change-in-production"},
		{"AIEngineURL", cfg.AIEngineURL, "localhost:50051"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.got != tt.expected {
				t.Errorf("%s = %q, want %q", tt.name, tt.got, tt.expected)
			}
		})
	}
}

func TestLoad_OverrideFromEnv(t *testing.T) {
	os.Setenv("PORT", "9090")
	os.Setenv("DATABASE_URL", "postgres://prod@db:5432/cloud")
	os.Setenv("JWT_SECRET", "super-secure-production-key")
	defer func() {
		os.Unsetenv("PORT")
		os.Unsetenv("DATABASE_URL")
		os.Unsetenv("JWT_SECRET")
	}()

	cfg := config.Load()

	if cfg.ServerPort != "9090" {
		t.Errorf("ServerPort = %q, want %q", cfg.ServerPort, "9090")
	}
	if cfg.DatabaseURL != "postgres://prod@db:5432/cloud" {
		t.Errorf("DatabaseURL = %q, want override", cfg.DatabaseURL)
	}
	if cfg.JWTSecret != "super-secure-production-key" {
		t.Errorf("JWTSecret = %q, want override", cfg.JWTSecret)
	}
	// Non-overridden should still have defaults
	if cfg.RedisURL != "localhost:6379" {
		t.Errorf("RedisURL = %q, want default", cfg.RedisURL)
	}
}

func TestLoad_EmptyEnvUsesDefault(t *testing.T) {
	os.Setenv("PORT", "")
	defer os.Unsetenv("PORT")

	cfg := config.Load()
	if cfg.ServerPort != "8080" {
		t.Errorf("Empty env should use default, got %q", cfg.ServerPort)
	}
}
