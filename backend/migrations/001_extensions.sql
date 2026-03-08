-- Migration 001: Enable required extensions
-- Apache AGE for graph queries (Cypher)
-- pgvector for vector similarity search

CREATE EXTENSION IF NOT EXISTS age;
CREATE EXTENSION IF NOT EXISTS vector;

-- Load AGE into the search path
SET search_path = ag_catalog, "$user", public;

-- Create the Context Cloud knowledge graph
SELECT create_graph('context_graph');
