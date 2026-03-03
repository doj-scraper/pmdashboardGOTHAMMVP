# Architecture Overview

## 1. System Context

Gotham PM Dashboard is a single Next.js application serving:
- Server-rendered/CSR UI dashboard (`src/app/page.tsx`)
- REST-like API routes (`src/app/api/**`)
- Prisma-backed data access layer (`src/lib/db.ts` + `prisma/schema.prisma`)
- GitHub integration endpoints (webhooks + issue sync)

## 2. High-Level Components

### Frontend

- **Dashboard page** orchestrates loading, status changes, issue creation, and sync calls.
- **Dashboard components** render:
  - pipeline progress
  - phase/module cards
  - task list and status controls
  - stats cards

### Backend (API Routes)

- **Projects API** (`/api/projects`): project + nested hierarchy reads, project creation.
- **Phases/Modules APIs** (`/api/phases`, `/api/modules`): hierarchy management.
- **Tasks API** (`/api/tasks`): filtering + updates with completion recalculation.
- **Stats API** (`/api/stats`): aggregate dashboard analytics.
- **SSE API** (`/api/sse`): near real-time client updates.
- **GitHub APIs**:
  - `/api/webhooks/github`: processes GitHub events, stage transitions, task completion.
  - `/api/github/create-issue`: creates GitHub issues from tasks.
  - `/api/github/sync`: sync behavior for issue linkage.

### Data Layer

- Prisma models define:
  - `Project -> Phase -> Module -> Task`
  - `GitHubEvent`
  - `GitHubIssueSync`
  - `GitHubCredentials`
  - `IssueCreationQueue`

## 3. Data Flow

### Dashboard Load
1. Client fetches `/api/projects`, `/api/phases`, `/api/tasks`, `/api/stats` in parallel.
2. API routes query Prisma.
3. Client renders hierarchy and KPI metrics.

### Task Status Update
1. Client sends `PATCH /api/tasks` with `taskId` + updates.
2. API updates task row.
3. API recalculates module and phase completion percentages.
4. Client refreshes dataset.

### GitHub Webhook Processing
1. GitHub sends event payload to `/api/webhooks/github`.
2. Signature is validated (strict in production mode).
3. Stage transition and/or task completion is derived from payload.
4. Project/task tables and event log are updated.

## 4. Deployment Topology (Vercel)

- **Runtime:** Vercel Next.js functions.
- **Build:** `next build`.
- **Database:** use managed Postgres in production (recommended).
- **Secrets:** Vercel Environment Variables.

## 5. Operational Considerations

- SQLite is acceptable for local-only workflows.
- For production:
  - use Postgres,
  - protect write endpoints with auth,
  - add centralized logging and alerting,
  - implement CI checks (`lint`, `build`, and API/integration tests).

## 6. Reliability and Security Notes

- Webhook signature checks are bypassed only outside production if invalid.
- API routes currently trust request body shapes and should be protected with schema validation.
- SSE connections are held in memory and may not fan out across multi-instance deployments; for scale, use a shared pub/sub layer.

## 7. Suggested Evolution Path

1. Add auth middleware for all mutating routes.
2. Introduce typed shared DTOs + Zod validation.
3. Move to Postgres and add Prisma migration discipline in CI/CD.
4. Add background queue for issue sync retries.
5. Add structured telemetry (OpenTelemetry/Sentry/Datadog).
