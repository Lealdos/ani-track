# AniTrack

## Project Overview

**AniTrack** is a full-stack anime discovery and tracking platform that lets users explore thousands of anime titles, organize their own watch lists, and follow weekly airing schedules. The project was designed and implemented end-to-end — UI, REST API, GraphQL integration, authentication, relational data model, and deployment — and showcases experience building production-grade web apps on the latest React/Next.js stack while integrating multiple third-party data sources behind a unified domain layer.

### Design Pattern: Repository (with Adapter)

The whole data layer — both the **two external APIs** (Jikan REST and AniList GraphQL) and the **internal REST API** (users, lists, favorites, currently watching, plan to watch, finished, comments) — is built around the **Repository pattern**, combined with the **Adapter pattern** for translating provider responses. The rest of the app only ever talks to clean, app-owned shapes through repository interfaces.

- **External APIs.** A single repository contract (`IAnimeRepository`) defines what the app needs from any anime data source. Two concrete repositories — `JikanAnimeRepository` (REST) and `AniListAnimeRepository` (GraphQL) — implement that interface, and each one uses dedicated **mappers (adapters)** (`jikanMappers.ts`, `anilistMappers.ts`) to translate the provider's response into the internal models (`Anime`, `Episode`, `Character`, `ScheduleDay`, …). Server Components, Server Actions, and the UI depend only on the repository abstraction and the domain models — never on Jikan or AniList types — so a provider can be swapped or extended without touching the rest of the codebase.
- **Internal API.** Each route handler under `src/app/api/users-lists/*` is split into **Model → Service → Controller** layers, where the **Model** acts as a repository over Prisma. Controllers and services consume small, intent-revealing methods (`findAllByUser`, `deleteByUserAndAnimeId`, `upsertMany`, …) instead of raw Prisma calls, isolating the rest of the backend from the ORM. The result is a uniform `{ success, data?, error? }` response shape regardless of which underlying table or query is involved, and Prisma could be replaced by another persistence layer without rewriting the API surface.

### Frontend

Built with **Next.js 16 (App Router)** and **React 19** using **Server Components** and **Server Actions** to push data fetching to the server and minimize client-side JavaScript. Styled with **Tailwind CSS 4** and **shadcn/ui** (Radix UI primitives) for an accessible, responsive interface; forms are handled with **react-hook-form** and validated with **Zod** schemas shared between client and server. Skeleton states, suspense boundaries, and route-level loading UIs are used to deliver a smooth, progressive user experience.

### Backend

The backend is implemented inside the same Next.js project as **Route Handlers** under `src/app/api/*`, exposing a custom REST API that manages everything related to users and their data: authentication, profile, custom lists, favorites, currently watching, plan-to-watch, finished anime, and comments. All endpoints follow a consistent `{ success, data?, error? }` response shape. Authentication is powered by **Better-auth** (email/password + Google and GitHub OAuth) with sessions stored in PostgreSQL. Persistence is handled with **Prisma 7** against a **Neon PostgreSQL** database, using **Prisma Accelerate** for connection pooling in serverless environments.

### External APIs

Anime metadata is fetched from two complementary public sources, wrapped behind a single repository interface in `src/entities/anime/`:

- **Jikan v4 (REST)** — used for the main catalog: titles, details, episodes, characters, genres, recommendations, and streaming platforms. A custom rate-limited client respects Jikan's request limits.
- **AniList (GraphQL)** — used for the weekly airing schedule and complementary data, with typed GraphQL queries and dedicated mappers that normalize results into the same domain models used across the app.

This dual-source design keeps the UI decoupled from any specific provider and demonstrates integrating both **REST** and **GraphQL** APIs in a single project.

## What you can do with the app

- **Browse and discover anime** — paginated catalog, trending and popular sections, filtering by genre.
- **Search** anime titles and open detailed pages with synopsis, episodes, characters, genres, and streaming platforms.
- **Weekly airing schedule** — see what's airing each day of the week, powered by the AniList GraphQL API.
- **Sign up / sign in** with email + password, Google, or GitHub.
- **Manage personal lists** — built-in lists for _Favorites_, _Currently Watching_, _Plan to Watch_, and _Finished_, plus user-created custom lists.
- **Track progress** by adding or removing anime from any list from the account dashboard.
- **Share public lists** through dedicated public URLs.
- **Manage your account** — update profile information and change your password.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19 (Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **Forms & validation:** react-hook-form + Zod
- **Auth:** Better-auth (email/password, Google OAuth, GitHub OAuth)
- **Database:** PostgreSQL (Neon) with Prisma 7 ORM and Prisma Accelerate
- **External data:** Jikan v4 (REST) + AniList (GraphQL)
- **Own backend:** Next.js Route Handlers (REST API for users, lists, favorites, comments)
- **Package manager / runtime:** Bun
- **Deployment:** Vercel
