# Gotham PM Dashboard

A production-focused project management dashboard for tracking delivery phases, modules, and tasks, with GitHub webhook + issue sync support.

> This repository was originally scaffolded with Z.ai tooling. The project documentation below is now customized for this codebase.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion
- **Data:** Prisma ORM
- **Current local DB:** SQLite (`db/custom.db`)
- **Integrations:** GitHub webhooks, GitHub issue creation/sync endpoints, SSE updates

## Core Features

- Phase/module/task hierarchy with weighted completion tracking
- Task status updates and assignment
- Project pipeline stage tracking (`idea → assets → mvp → qa → docker → review → prod`)
- GitHub webhook ingestion for stage + task completion updates
- GitHub issue creation/sync API routes
- Server-Sent Events for near real-time dashboard refreshes

## Project Structure

```txt
src/
  app/
    api/
      github/
      modules/
      phases/
      projects/
      sse/
      stats/
      tasks/
      webhooks/github/
    layout.tsx
    page.tsx
  components/
    dashboard/
    ui/
  hooks/
  lib/
prisma/
  schema.prisma
```

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env.local`:

```bash
DATABASE_URL="file:./db/custom.db"
GITHUB_WEBHOOK_SECRET="replace-me"
GITHUB_TOKEN="replace-me"
GITHUB_OWNER="your-org-or-user"
```

### 3) Generate Prisma client + push schema

```bash
npm run db:generate
npm run db:push
```

### 4) Run dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Production / Vercel Deployment

### Important database note

`SQLite` is fine for local development, but **not recommended for Vercel production** due to ephemeral/read-only filesystem constraints for runtime writes.

For production, migrate to a managed Postgres provider (Neon, Supabase, Vercel Postgres, RDS, etc.) and update `DATABASE_URL` accordingly.

### Vercel steps

1. Import repository in Vercel.
2. Configure environment variables in Vercel Project Settings:
   - `DATABASE_URL`
   - `GITHUB_WEBHOOK_SECRET`
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
3. Deploy with default Next.js settings (this repo includes `vercel.json`).
4. After first deploy, run schema sync against your production DB (CI job or one-off):
   - `npx prisma db push`

## Scripts

- `npm run dev` – local development server
- `npm run build` – production build (Vercel-compatible)
- `npm run start` – run built app locally
- `npm run lint` – ESLint
- `npm run db:generate` – Prisma client generation
- `npm run db:push` – push Prisma schema to DB
- `npm run db:migrate` – create/apply dev migration
- `npm run db:reset` – reset development DB

## API Overview

- `GET/POST /api/projects`
- `GET/POST/PATCH /api/tasks`
- `GET/POST /api/phases`
- `GET/POST /api/modules`
- `GET /api/stats`
- `GET /api/sse`
- `POST /api/webhooks/github`
- `POST /api/github/create-issue`
- `POST /api/github/sync`

## Recommended Next Steps

- Add authentication/authorization around mutating API routes
- Move production DB to Postgres + add migration workflow in CI
- Add route-level validation with shared Zod schemas
- Add integration tests for API routes and webhook signature verification
- Add observability (request logging, error reporting, uptime checks)
