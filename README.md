# Context Cloud

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Go](https://img.shields.io/badge/Go-1.26-00ADD8?logo=go)](https://go.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org)

**The AI-native context infrastructure for the agentic enterprise.**

Transform fragmented databases and operational systems into a deterministic, agent-ready knowledge graph. Built with a 100% open-source stack.

---

## Architecture

```
Next.js (UI) → Go API Gateway (Gin) → PostgreSQL (AGE + pgvector)
                    ↕ gRPC                    ↕
              Python AI Engine          Redis / MinIO / Kafka
```

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16, TypeScript, React Flow, Framer Motion | Premium UI, Graph Explorer, SDK Playground |
| API Gateway | Go, Gin, pgx, JWT | REST API, auth, rate limiting, multi-tenant |
| Ingestion | Go, Kafka, MinIO | Async CSV parsing, file storage |
| AI Engine | Python, FastAPI, spaCy, sentence-transformers | NER, embeddings, relationship inference |
| Graph DB | PostgreSQL + Apache AGE | Cypher-powered knowledge graph |
| Vector Search | pgvector | Semantic similarity search |
| Cache | Redis | Payload caching, rate limit counters |
| Storage | MinIO | S3-compatible raw file uploads |
| Events | Apache Kafka | Async ingestion job queue |

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (for infrastructure)
- [Go 1.22+](https://go.dev/dl/) (for API Gateway)
- [Node.js 20+](https://nodejs.org/) (for frontend)
- [Python 3.12+](https://www.python.org/) (for AI Engine)

### 1. Start Infrastructure

```bash
# Spins up PostgreSQL+AGE, Redis, MinIO, and Kafka
docker compose up -d
```

### 2. Start Go API Gateway (port 8080)

```bash
cd backend && go run ./cmd/api/main.go
```

### 3. Start Next.js Frontend (port 3000)

```bash
npm install && npm run dev
```

### 4. (Optional) Start Python AI Engine (port 8081)

```bash
cd ai-engine
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python -m app.main
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/entities` | List all entities (paginated) |
| `GET` | `/api/v1/entities/:id` | Get entity by external ID |
| `GET` | `/api/v1/entities/:id/events` | Get entity timeline |
| `GET` | `/api/v1/entities/:id/relationships` | Get graph relationships |
| `GET` | `/api/v1/context/:id` | **Agent-optimized** context payload |
| `POST` | `/api/v1/ingest/upload` | Upload CSV for ingestion |

## Project Structure

```
contextcloud/
├── app/                    # Next.js pages (Dashboard, Explorer, SDK Playground)
├── components/             # React components (atoms, molecules, organisms)
├── lib/                    # TypeScript types, mock data, utils
├── backend/
│   ├── cmd/api/            # Go API Gateway binary
│   ├── cmd/ingestion/      # Go Kafka consumer binary
│   ├── internal/handler/   # HTTP route handlers
│   ├── internal/repository/# PostgreSQL, Redis, MinIO data access
│   ├── internal/middleware/ # JWT auth, rate limiting
│   ├── internal/model/     # Domain types
│   ├── migrations/         # SQL schema + seed data
│   └── proto/              # gRPC definitions
├── ai-engine/
│   ├── app/main.py         # FastAPI + gRPC server
│   └── app/services/       # NER, embeddings, relationship inference
├── docker-compose.yml      # Full infrastructure stack
├── Makefile                # Developer workflow commands
└── .env.example            # Configuration template
```

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) — free to use, modify, and self-host.

**Enterprise licensing** with commercial support, SSO, RBAC, and SLA guarantees is available. [Contact us](mailto:hello@contextcloud.dev) for details.
