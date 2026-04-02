# TaskTracker

TaskTracker is a Next.js 16 task management app with Arabic-friendly task data, file import/export, notifications, and operational dashboards. This repository is prepared for local development with SQLite and production deployment on Cloudflare Workers with D1.

## Project analysis

- Framework: Next.js 16 with the App Router
- Language: TypeScript
- UI stack: Tailwind CSS 4, shadcn/ui, Radix UI
- State/data tooling: React Query, Zustand, React Hook Form, Zod
- Database for local development: Prisma + SQLite
- Production target: Cloudflare Workers via OpenNext, with D1 as the Workers-compatible database
- Package manager / lockfile: Bun (`bun.lock`)
- Build adapter for Cloudflare: `@opennextjs/cloudflare`

## Repository structure

```text
.
├── .github/workflows/deploy.yml   # GitHub Actions -> Cloudflare deploy
├── db/                            # Local SQLite database for development
├── prisma/schema.prisma           # Prisma data model
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js app routes and API routes
│   ├── components/                # UI components
│   ├── hooks/                     # React hooks
│   └── lib/                       # Database and email helpers
├── .env.example                   # Local env template
├── .dev.vars.example              # Wrangler local env template
├── next.config.ts                 # Next.js config for local dev + OpenNext
├── open-next.config.ts            # OpenNext Cloudflare adapter config
├── package.json                   # Scripts and dependencies
└── wrangler.jsonc                 # Cloudflare Worker config
```

## Environment variables

Copy the templates before running locally:

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

Variables used by the app:

```env
DATABASE_URL="file:./db/custom.db"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
CRON_SECRET="replace-with-a-long-random-secret"
```

Notes:

- `.env` is used by Prisma and local Next.js development.
- `.dev.vars` is used by Wrangler/OpenNext local preview.
- Production secrets should be stored in Cloudflare, not committed to Git.

## Local development

```bash
bun install
bun run db:generate
bun run db:push
bun run dev
```

App URL:

```text
http://localhost:3000
```

## Cloudflare Workers deployment

This repo is configured to deploy a Next.js app to Cloudflare Workers using OpenNext.

### Important database note

The app previously relied on SQLite directly. That does not run on Cloudflare Workers as-is. The project has been wired so local development stays on SQLite, while Cloudflare uses the `DB` D1 binding from [`wrangler.jsonc`](/Users/mohammedzaher/Downloads/Task%20Tracking%20/wrangler.jsonc).

Before deploying:

1. Create a D1 database.
2. Put the returned database ID into `wrangler.jsonc`.
3. Generate and apply a migration to D1.
4. Set production secrets in Cloudflare.

### Recommended Cloudflare commands

Create the D1 database:

```bash
bunx wrangler d1 create tasktracker-db
```

Create the first D1 migration file:

```bash
bunx wrangler d1 migrations create tasktracker-db initial_schema
```

Generate SQL from the Prisma schema into that migration file:

```bash
bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script --output migrations/0001_initial_schema.sql
```

Apply the migration locally to the Wrangler D1 emulator:

```bash
bunx wrangler d1 migrations apply tasktracker-db --local
```

Apply the migration remotely to Cloudflare D1:

```bash
bunx wrangler d1 migrations apply tasktracker-db --remote
```

Set production secrets:

```bash
bunx wrangler secret put RESEND_API_KEY
bunx wrangler secret put FROM_EMAIL
bunx wrangler secret put ADMIN_EMAIL
bunx wrangler secret put CRON_SECRET
```

Build and preview the Worker locally:

```bash
bun run preview
```

Deploy to Cloudflare:

```bash
bun run deploy
```

## GitHub repository setup

If this folder is not yet linked to GitHub, use the following exact commands.

Initialize and prepare the local repo:

```bash
git init
git branch -m main
git add .
git commit -m "Initial Cloudflare-ready project setup"
```

Create a GitHub repository with the GitHub CLI:

```bash
gh repo create tasktracker --private --source=. --remote=origin --push
```

If you prefer creating the repo first in the GitHub UI, then link it manually:

```bash
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/tasktracker.git
git push -u origin main
```

## CI/CD

GitHub Actions is already configured in [`.github/workflows/deploy.yml`](/Users/mohammedzaher/Downloads/Task%20Tracking%20/.github/workflows/deploy.yml).

Add these GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

On every push to `main`, GitHub Actions will:

1. Install dependencies with Bun
2. Generate the Prisma client
3. Build and deploy the Cloudflare Worker

## Production checklist

- Update the D1 database ID in [`wrangler.jsonc`](/Users/mohammedzaher/Downloads/Task%20Tracking%20/wrangler.jsonc)
- Create and apply D1 migrations
- Add Cloudflare secrets
- Push the repository to GitHub
- Verify the first deployment in GitHub Actions and the Cloudflare dashboard
