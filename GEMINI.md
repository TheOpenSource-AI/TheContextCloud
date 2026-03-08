# State-of-the-Art (SOTA) AI Development Constraints for Context Cloud

This document enforces the rigorous, state-of-the-art technical, architectural, and aesthetic rules for building the Context Cloud MVP. Gemini (the AI Assistant) must adhere to these directives without exception. Our goal is to build an elite, venture-grade infrastructure platform, not a basic prototype.

---

## 1. Elite Architectural & Infrastructure Philosophy

*   **Production-Ready Foundation First:** Even as an MVP, the architecture must demonstrate readiness for horizontal scaling. Use Next.js App Router with an explicit decoupling of Server Components (for data-fetching and SEO-optimized shells) and Client Components (for high-fidelity interactivity).
*   **Edge-Ready Data Abstractions:** Assume deployment to Vercel/Cloudflare Edge. Do not use node-specific heavy modules in the API layer unless isolated. State must be handled immutably.
*   **Typescript Transcendence:** Not a single `any` is permitted. Use advanced TypeScript features (e.g., Discriminated Unions for event types, Utility Types for partial updates, Zod for strict schema validation layer on all API boundaries).
*   **Deterministic Backend Mocking:** The frontend MUST assume the backend is asynchronous, occasionally slow, and failure-prone. All mock data fetches must include artificial latency jitter (e.g., 200ms - 800ms) to force the UI to render realistic edge states (loading, partial data, timeout recovery).

## 2. Ultra-Premium UI/UX Diagnostics

*   **The "Context Cloud" Vibe:** The application must feel like a Tier-1 infrastructure company (Stripe, Linear, Vercel, OpenAI). It must exude calm, clarity, and immense power.
*   **Obsessive Typography & Spacing:**
    *   Primary Font: **Geist** or **Inter** with aggressively tuned tracking and line heights.
    *   Monospace Font: **Geist Mono** or **JetBrains Mono** for all code blocks, JSON payloads, and technical badges.
    *   Spacing: Use tailwind's `space-y-*` and `gap-*` utilities structurally. Avoid margin collapsing. Maximize whitespace to prevent cognitive overload during dense data visualization.
*   **Subtractive Color Theory:**
    *   The palette is exclusively monochromatic (slate/zinc) with extremely restrained accenting.
    *   Borders are `border-slate-200/50`. Cards use `shadow-sm` and `bg-white/90` with subtle backdrop blurring for depth (`backdrop-blur-xl`).
    *   Colors (Green, Orange, Red) are reserved strictly for semantic meaning (Confidence Scores, Success States, Critical Errors) and never for decoration.
*   **Micro-Interactions & Physics:**
    *   Use `framer-motion` for spring-physics-based animations. No linear CSS transitions.
    *   Hover states must provide immediate tactile feedback (e.g., slight `scale: 1.01`, subtle shadow elevation).

## 3. Bulletproof Engineering & Resiliency

*   **Zero-Crash Architecture:** Wrap every major interactive section (especially the React Flow canvas) in localized React Error Boundaries. If the graph engine fails to render a malformed payload, it must gracefully fallback to a standard list view, accompanied by a beautifully formatted error explanation.
*   **Defensive Rendering:** Never assume data is present. Use optional chaining `?.` and nullish coalescing `??`. Provide atomic `EmptyState` illustrations for every single array or object that might return empty.
*   **Performance Budgeting:**
    *   The React Flow engine must implement node culling/virtualization if nodes exceed 50.
    *   SVG icons (Lucide) must be dynamically loaded or tree-shaken.

## 4. Work Breakdown & Context Window Management

*   **Atomic Commits & Execution:** Do not attempt to build 6 components in one prompt. Build the core layout -> Verify -> Build the Data Layer -> Verify -> Build the UI Atoms -> Verify.
*   **Visual Perfection over Backend Complexity:** If a graph algorithm is taking too long to mock, hardcode a perfectly structured output and spend that time making the graph visually stunning. The visual output is the MVP.

## 5. Security & PII Handling (Enterprise Posture)

*   Even in mock data, demonstrate Enterprise compliance. Include fields like `dataClassification: "Confidential"` or `piiRedacted: true` in the payloads to signal to enterprise buyers that the platform is built for highly regulated industries (Insurance/Banking).
