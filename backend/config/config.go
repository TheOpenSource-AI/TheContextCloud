package config

import (
	"os"
)

type Config struct {
	ServerPort  string
	DatabaseURL string
	RedisURL    string
	MinioURL    string
	MinioKey    string
	MinioSecret string
	MinioBucket string
	KafkaBroker string
	JWTSecret   string
	AIEngineURL string // gRPC address for Python AI Engine
}

func Load() *Config {
	return &Config{
		ServerPort:  getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://cc_admin:cc_dev_password@localhost:5432/contextcloud?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "localhost:6379"),
		MinioURL:    getEnv("MINIO_URL", "localhost:9000"),
		MinioKey:    getEnv("MINIO_ACCESS_KEY", "minioadmin"),
		MinioSecret: getEnv("MINIO_SECRET_KEY", "minioadmin"),
		MinioBucket: getEnv("MINIO_BUCKET", "context-cloud-uploads"),
		KafkaBroker: getEnv("KAFKA_BROKER", "localhost:9092"),
		JWTSecret:   getEnv("JWT_SECRET", "dev-secret-change-in-production"),
		AIEngineURL: getEnv("AI_ENGINE_URL", "localhost:50051"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
