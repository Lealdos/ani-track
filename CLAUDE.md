# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev           # Start dev server with Turbopack (Next.js fast HMR)
bun run build         # Production build
bun run clean-build   # Remove .next cache and rebuild
bun run lint          # ESLint via Next.js
bun run pretty        # Prettier format all files in src/
bun run setupDB       # Start PostgreSQL via docker-compose
bun run prisma:migrate  # Run Prisma migrations (dev mode)
```

No test suite is configured.

## Architecture

AniTrack is a full-stack anime discovery and tracking platform built with **Next.js 16 App Router** + **React 19**.

### Request Flow

```
Browser → React components → Next.js API routes → Prisma → PostgreSQL (Neon)
                                              ↕
                                         Jikan API v4 (external anime metadata)
```

### Routing Structure

- `src/app/(home)/` — public pages (Home, Browse, Anime detail)
- `src/app/(auth)/` — authentication pages (sign-in, sign-up, account)
- `src/app/api/` — route handlers:
  - `/api/auth/[...all]` — Better-auth (handles sessions, OAuth, sign-in/sign-up)
  - `/api/users/me`, `/api/users/:id` — user CRUD
  - `/api/users-lists/`, `/api/users-lists/favorites` — list and favorites management

### Key Layers

**External Anime Data** — `src/services/JikanAPI/`  
Wrapper around Jikan v4 API with rate limiting. All anime metadata (titles, episodes, genres, schedules, characters) comes from here.

**Authentication** — `src/lib/auth.ts`  
Better-auth with email/password + Google + GitHub OAuth. Prisma adapter writes sessions to PostgreSQL. Custom `userName` field on users.

**Database** — `prisma/schema.prisma`  
Prisma 7 + PostgreSQL (Neon with Accelerate for connection pooling). Generated client lives at `src/generated/prisma`. Key models: `User`, `UserLists`, `UserListItems`, `UserFavoritesList`, `CurrentWatching`, `Comment`.

**UI** — Tailwind CSS 4 + shadcn/ui (Radix UI primitives). Shared components in `src/components/shared/` (AnimeCard, AnimeList, Header, Footer, Pagination). Form validation uses react-hook-form + Zod.

**Path Aliases**  
- `@/*` → `src/`
- `@services/*` → `src/services/`

### Environment Variables

Required in `.env` / `.env.local`:
- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `BETTER_AUTH_SECRET` — auth session secret
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`

### API Response Convention

All API routes return a standard shape: `{ success: boolean, data?: ..., error?: ... }`. See `src/lib/utils/` for response/error helpers.
