# AGENTS Guide (Repository Scope)

This file provides operational guidance for contributors and coding agents working in this repository.

## Project intent

This is a production-oriented Next.js + Prisma dashboard for project and GitHub workflow tracking.

## Standards

- Keep all new/updated application code in **TypeScript**.
- Prefer small, testable, incremental changes.
- Do not check in secrets, API tokens, or private webhook payloads.
- When changing API contracts, update docs in `README.md` and `docs/ARCHITECTURE.md`.

## Deployment expectations

- Vercel is the target platform.
- Preserve compatibility with `next build` and serverless runtime behavior.
- Do not assume writable local filesystem in production.

## Database guidance

- Local development may use SQLite.
- Production should use managed Postgres via `DATABASE_URL`.
- Ensure Prisma client generation remains part of setup/docs.

## Validation checklist for changes

Run these before committing:

1. `npm run lint`
2. `npm run build`

If build/test cannot run due environment constraints, clearly document the limitation and a remediation path.
