# Contributing to Context Cloud

Thank you for your interest in contributing to Context Cloud! We welcome contributions from the community.

## 📋 How to Contribute

### Reporting Bugs

1. Check [existing issues](../../issues) to avoid duplicates
2. Use the bug report template
3. Include: OS, Node/Go/Python versions, steps to reproduce, expected vs actual behavior

### Suggesting Features

Open an issue with the `enhancement` label. Describe:
- The problem you're solving
- Your proposed solution
- Any alternatives considered

### Pull Requests

1. **Fork** the repository
2. **Branch** from `main`: `git checkout -b feat/your-feature`
3. **Write tests** for any new functionality
4. **Follow** existing code style and conventions
5. **Commit** with conventional commits: `feat:`, `fix:`, `docs:`, `test:`
6. **Open a PR** with a clear description

## 🏗 Development Setup

```bash
# Clone and install frontend
git clone https://github.com/YOUR_ORG/contextcloud.git
cd contextcloud
npm install

# Start infrastructure (Postgres, Redis, Kafka, MinIO)
make infra

# Run frontend
npm run dev

# Run Go backend
make dev

# Run tests
make test                                    # Go tests
cd ai-engine && source .venv/bin/activate && pytest tests/ -v  # Python tests
```

## 📁 Project Structure

| Directory | Language | Purpose |
|-----------|----------|---------|
| `app/` | TypeScript | Next.js frontend pages |
| `components/` | TypeScript | React UI components |
| `lib/` | TypeScript | API client, types, mock data |
| `backend/` | Go | API Gateway + Ingestion Pipeline |
| `ai-engine/` | Python | NER, Embeddings, Relationship Inference |

## ✅ Code Standards

- **TypeScript**: No `any` types. Use Zod for API validation.
- **Go**: Run `go vet ./...` and `go test ./...` before submitting.
- **Python**: Type hints on all functions. Run `pytest` with 100% pass rate.
- **Tests**: Every new feature must include unit tests.

## 📄 License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0 License](LICENSE).

For enterprise licensing inquiries, contact the maintainers.
