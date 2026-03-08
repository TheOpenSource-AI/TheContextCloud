Build a production-style MVP web application called **Context Cloud**.

Context Cloud is an AI-native enterprise context platform that sits between enterprise systems and AI models/agents. It transforms fragmented business data into agent-ready business context.

The product should feel like a premium modern SaaS app with the visual quality of OpenAI’s light theme, the simplicity of Notion, and the product polish of Linear and Vercel.

====================
1. PRODUCT VISION
====================

Context Cloud solves the missing “system of context” layer in the enterprise AI stack.

Traditional architecture:
Systems of Record -> LLMs -> Agents

Target architecture:
Systems of Record -> Context Cloud -> AI Models / Agents / Applications

Context Cloud should:
- ingest business data from multiple sources
- detect entities, relationships, and events
- build a context graph
- expose clean APIs and SDKs for agent consumption
- provide a beautiful UI to explore context
- support model-agnostic usage across OpenAI, Anthropic, Gemini, and open models

This MVP should be positioned as:
**The Context Infrastructure for the Agentic Enterprise**

====================
2. MVP GOALS
====================

Build an MVP that demonstrates these core capabilities:

1. Ingest data from CSV and mock API sources
2. Detect and store:
   - entities
   - relationships
   - events
3. Build a context graph
4. Let users explore the graph visually
5. Let users inspect an entity in detail
6. Show a timeline of events
7. Provide API and SDK example screens
8. Show an “Agent View” of context payloads
9. Use a modern light-theme UI that looks polished and viral

====================
3. TARGET USERS
====================

Primary:
- AI developers
- data engineers
- agent builders

Secondary:
- enterprise data architects
- CDO / CIO / AI transformation buyers

The UX must be easy for developers to try quickly and polished enough for enterprise demos.

====================
4. TECH STACK
====================

Use this stack:

Frontend:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

UI / visualization:
- React Flow OR a similarly elegant graph visualization library
- Lucide icons
- Recharts only if needed
- use a monospace font for API/code areas

Backend:
- Next.js API routes or a small internal API layer
- TypeScript preferred end-to-end
- if needed, create a simple service layer inside the app

Database / persistence:
- Supabase Postgres OR local mock JSON persistence if simpler for MVP
- structure the code so it can easily migrate to Supabase
- include seed demo data

AI layer:
- create abstraction interfaces for future OpenAI / Anthropic support
- for MVP, mock AI extraction if necessary
- optionally include placeholder service functions like:
  extractEntities()
  detectRelationships()
  buildTimeline()

Do not over-engineer. Prioritize a beautiful working MVP.

====================
5. DESIGN SYSTEM
====================

The app must be light-theme only.

Design style:
- premium, calm, minimal
- inspired by OpenAI ChatGPT light mode
- lots of whitespace
- subtle shadows
- rounded corners
- thin borders
- restrained accent colors
- no clutter
- no loud enterprise dashboard feel

Color direction:
- background: soft off-white
- surfaces: white
- borders: light gray
- primary text: near-black
- secondary text: muted gray
- accent: subtle green or teal, used sparingly

Use:
- Inter or Geist font
- large clean page headings
- soft card layouts
- elegant hover states
- smooth transitions
- tasteful skeleton loaders

The UI should look screenshot-worthy for LinkedIn and X.

====================
6. INFORMATION ARCHITECTURE
====================

Create a left sidebar layout with a clean top header.

Sidebar items:
- Home
- Context Explorer
- Entities
- Relationships
- Timelines
- Ingestion
- API / SDK
- Agent View
- Settings

Bottom sidebar:
- workspace selector
- user avatar
- help/docs link

Top header:
- page title
- optional breadcrumbs
- search bar
- workspace name
- primary action button

====================
7. CORE DATA MODEL
====================

Model the system around three primary context primitives:

1. Entity
Fields:
- id
- type
- name
- description
- attributes (JSON)
- sourceSystems (array)
- confidenceScore
- createdAt
- updatedAt

2. Relationship
Fields:
- id
- fromEntityId
- toEntityId
- relationshipType
- description
- confidenceScore
- sourceSystems
- createdAt

3. Event
Fields:
- id
- entityId
- eventType
- title
- description
- timestamp
- metadata
- sourceSystem

Also define:
4. Context Snapshot / Agent Payload
Fields:
- id
- entityId
- summary
- structuredContext
- relationships
- recentEvents
- memoryNotes
- generatedAt

Include seed demo data using an insurance / enterprise-friendly example such as:
- Customer
- Policy
- Claim
- Supplier
- Product
- Transaction

Example relationships:
- Customer owns Policy
- Policy triggered Claim
- Claim assigned to Supplier

Example events:
- Policy created
- Claim filed
- Claim approved
- Payment processed

====================
8. MAIN SCREENS
====================

Build these screens:

--------------------------------
A. HOME / DASHBOARD
--------------------------------

Purpose:
Give the user immediate confidence that Context Cloud has transformed business data into agent-ready context.

Sections:
- hero title: “Your business context, ready for agents”
- short subtext
- primary CTA: “Ingest data”
- secondary CTA: “Explore demo workspace”

Show summary cards:
- Total Entities
- Total Relationships
- Total Events
- Connected Sources
- Agent-ready Endpoints

Show additional cards:
- recent ingestions
- recent entities viewed
- suggested actions

Include a polished mini graph preview in the hero area.

This page should feel like a premium AI-native workspace.

--------------------------------
B. CONTEXT EXPLORER
--------------------------------

This is the flagship screen.

Layout:
- left panel: search + filters
- center panel: interactive graph canvas
- right panel: entity detail drawer

Left panel should include:
- search input
- filters by entity type
- filters by source system
- filters by date range
- saved views

Center graph:
- clean modern graph visualization
- zoom / pan
- click nodes to inspect
- hover edges to show relationship labels
- subtle animations
- avoid graph clutter

Right drawer:
- entity name
- entity type badge
- summary
- key attributes
- related entities
- recent events
- button to open full entity page
- button to generate agent payload

This screen must be very visually impressive.

--------------------------------
C. ENTITY DETAIL PAGE
--------------------------------

Purpose:
Show a rich but simple view for one business entity.

Top area:
- entity name
- entity type
- confidence score
- source systems
- actions

Use tabs:
- Overview
- Relationships
- Timeline
- Documents
- Agent View

Overview:
- summary card
- key attributes
- signals / scores
- related entity counts

Relationships:
- structured relationship list
- mini graph preview

Timeline:
- chronological events

Documents:
- placeholder section for future document context

Agent View:
- show how an AI agent sees this entity
- include compact structured JSON payload
- include a “copy payload” button

--------------------------------
D. INGESTION FLOW
--------------------------------

Create a wizard-style 4-step flow.

Steps:
1. Choose source
2. Map source
3. Generate context
4. Review results

Step 1:
Source cards:
- CSV Upload
- Database (mock)
- API (mock)
- Documents (placeholder)

Step 2:
Mapping screen:
- source fields
- suggested entity types
- confidence scores
- editable mappings
- simple interface, not overly technical

Step 3:
Generation screen:
Show a beautiful progress state with lines like:
- Identifying entities
- Detecting relationships
- Building event timeline
- Preparing context graph

Use elegant progress UI, not generic loaders.

Step 4:
Review screen:
- entities created
- relationships detected
- events generated
- graph preview
- publish button

This should feel magical.

--------------------------------
E. TIMELINES
--------------------------------

Purpose:
Explore event history over time.

Include:
- filters by entity
- filters by event type
- date range filter
- vertical timeline layout
- event cards with icons, labels, timestamps, metadata

Make this page useful for explainability and audit.

--------------------------------
F. API / SDK PLAYGROUND
--------------------------------

Purpose:
Make the developer experience easy and premium.

Layout:
- left panel: endpoint / SDK navigation
- right panel: live response preview

Sections:
- REST API
- Python SDK
- JavaScript SDK
- curl

Show example endpoints:
- GET /context/entity/:type/:id
- GET /context/relationships/:entityId
- GET /context/timeline/:entityId
- POST /context/search

Include copy buttons and example responses.

Style this more like Stripe docs than a corporate API page.

--------------------------------
G. AGENT VIEW
--------------------------------

Purpose:
Show how agents consume context.

Sections:
- select an entity
- select an agent type
- generate context payload
- show:
  - raw context
  - structured context
  - memory notes
  - reasoning hints
  - tool-ready JSON

This should clearly connect Context Cloud to future AgentsX integration.

====================
9. KEY UX COMPONENTS
====================

Build reusable polished components:

- ContextCard
- EntityBadge
- RelationshipChip
- TimelineEventCard
- GraphNodeCard
- SourceBadge
- ConfidenceScoreBadge
- ContextSummaryPanel
- CodeResponsePanel
- SearchCommandBar
- EmptyStatePanel
- SkeletonLoader

Include:
- tasteful hover effects
- smooth page transitions
- responsive cards
- consistent spacing
- clean visual hierarchy

====================
10. UNIVERSAL SEARCH
====================

Implement a prominent search experience.

Users should be able to search for:
- customer names
- policy ids
- claim ids
- supplier names

Also include example natural search placeholders such as:
- “Show all high-risk suppliers”
- “Find claims linked to customer 102”
- “Open policy P-2041”

At MVP level, this can map to structured demo queries.

====================
11. DEMO DATA AND STATES
====================

Seed the app with realistic demo data.

Create at least:
- 12 entities
- 18 relationships
- 20 events

Use an insurance / enterprise scenario so the product feels commercially relevant.

Include:
- a few high-confidence mappings
- a few lower-confidence relationships
- 2 data sources
- 1 recent ingestion job
- 2 saved searches

Add elegant empty states where appropriate.

====================
12. API CONTRACTS
====================

Create internal mock API routes or service functions for:

GET /api/entities
GET /api/entities/[id]
GET /api/relationships
GET /api/events
GET /api/context/[entityId]
POST /api/ingest/upload
POST /api/context/generate
POST /api/search

These can use static seeded data for MVP, but structure them as real APIs.

====================
13. FOLDER STRUCTURE
====================

Create a clean scalable folder structure, for example:

/app
  /(dashboard)
  /context-explorer
  /entities/[id]
  /timelines
  /ingestion
  /api-sdk
  /agent-view
  /settings

/components
  /layout
  /cards
  /graph
  /timeline
  /search
  /api
  /ui

/lib
  /data
  /services
  /types
  /utils

/mock
  seed data files

/styles

Keep the code modular and readable.

====================
14. MOTION AND INTERACTIONS
====================

Use Framer Motion carefully.

Add:
- page fade-in
- panel slide-in
- drawer transitions
- card hover lift
- graph node hover states
- skeleton loading placeholders

Motion must feel premium, not flashy.

====================
15. RESPONSIVENESS
====================

Desktop-first, but responsive.

Requirements:
- sidebar collapses on smaller screens
- graph area adapts gracefully
- drawers become stacked panels
- tables/cards remain readable
- API playground remains usable

====================
16. ENTERPRISE POSITIONING DETAILS
====================

Throughout the app, subtly reinforce that this is:
- enterprise-grade
- model-agnostic
- agent-ready
- governance-friendly

Use small textual cues such as:
- “Works across OpenAI, Anthropic, Gemini, and open models”
- “Business context prepared for agents”
- “Portable, governed context infrastructure”

====================
17. WHAT GOOD LOOKS LIKE
====================

The final result should feel like:
- a believable venture-backed AI infrastructure startup product
- premium enough for screenshots and demos
- simple enough that a developer understands it in 60 seconds
- elegant enough that a CIO thinks it is serious
- clear enough that it supports future open source and enterprise narratives

====================
18. OUTPUT REQUIREMENTS
====================

Please generate:
1. the full Next.js app scaffold
2. all screens listed above
3. reusable UI components
4. seeded mock data
5. mock API routes
6. polished light-theme styling
7. realistic demo content
8. smooth interactions
9. clear README with setup instructions

After generating the app, also provide:
- a short explanation of the architecture
- a summary of component structure
- recommended next steps to connect real data ingestion and real LLM extraction

Do not create a generic admin dashboard.
Create a memorable, elegant AI-native product UI.