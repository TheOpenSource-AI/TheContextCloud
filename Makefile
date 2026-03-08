.PHONY: dev build infra infra-down migrate test

# Start all infrastructure (PostgreSQL+AGE, Redis, MinIO, Kafka)
infra:
	docker compose up -d

# Stop infrastructure
infra-down:
	docker compose down

# Run database migrations manually (used if not auto-loaded by docker init)
migrate:
	@echo "Migrations are auto-applied via docker-entrypoint-initdb.d on first run"
	@echo "To re-run: docker compose down -v && docker compose up -d"

# Run the Go API server
dev:
	cd backend && go run ./cmd/api/main.go

# Build the Go API binary
build:
	cd backend && go build -o ../bin/api ./cmd/api/main.go

# Run Go tests
test:
	cd backend && go test ./...

# Install Go dependencies
deps:
	cd backend && go mod tidy

# Generate gRPC stubs (requires protoc + protoc-gen-go)
proto:
	protoc --go_out=backend --go-grpc_out=backend backend/proto/ai_engine.proto

# Run everything (infra + api + frontend)
all: infra
	@echo "Starting Go API..."
	@make dev &
	@echo "Starting Next.js frontend..."
	@cd . && npm run dev
