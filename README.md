# Anime Library

A web application built with Next.js that allows users to browse and discover anime. It utilizes the [Jikan v4 API](https://jikan.moe/) to fetch anime data, Neon PostgreSQL to store user data, and Better Auth for authentication.

## Features

- Browse a large database of anime.
- Search for specific anime titles.
- View detailed information about each anime, including synopsis, genres, and streaming platforms.
- Explore trending and popular anime.
- Add anime to your favorites list (coming soon).

## Installation

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/ani-track.git
    cd ani-track
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    - Copy `.env.example` to `.env.local`
    - Fill in your actual values:
        - Get Neon database URL from [console.neon.tech](https://console.neon.tech)
        - Configure OAuth apps (Google & GitHub)
        - Generate secrets using `openssl rand -hex 32`

4.  **Run database migrations:**

    ```bash
    bunx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    bun dev
    ```

## Environment Configuration

This project uses different environment files for different contexts:

- **`.env.local`** - Local development (gitignored, your personal config)
- **`.env.production`** - Production variable names (committed, values set in CI/CD)
- **`.env.example`** - Template for new developers (committed)
- **`.env`** - Legacy file (gitignored, not used)
