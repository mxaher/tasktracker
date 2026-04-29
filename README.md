# 🗂️ TaskTracker

> A production-grade task and performance management platform built with Next.js, TypeScript, and deployed on Cloudflare Workers with D1. Designed to handle multi-entity operations including task tracking, KPI management, employee performance, and real-time notifications — with full Arabic language data support.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [API Surface](#api-surface)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Database Management](#database-management)
- [Cloudflare Workers Deployment](#cloudflare-workers-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Notification System](#notification-system)
- [Import / Export](#import--export)
- [MCP Server](#mcp-server)
- [Production Checklist](#production-checklist)

---

## Overview

TaskTracker is a full-stack operational platform originally conceived to manage tasks across a diversified holding group. It goes well beyond simple to-do lists — the system tracks task assignments, monitors KPI actuals vs. targets across companies and employees, sends scheduled email and Telegram notifications, and provides dashboards for operational visibility.

The architecture runs **locally on SQLite via Prisma** and **in production on Cloudflare Workers with D1**, enabled through the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare). This makes it fast, globally distributed, and serverless by default.

---

## Key Features

- **Task Management** — Full CRUD for tasks with status, priority, assignment to employees, and deadline tracking
- **KPI Engine** — Multi-level KPIs: company-level, employee-level, and custom KPIs with monthly targets and actuals
- **Employee & Manager Profiles** — Position tracking, hierarchical manager-employee relationships
- **Notification System** — Email notifications via Resend and Telegram bot integration for real-time alerts
- **Scheduled Reminders** — Cron-based reminder jobs triggered via a secret-protected API endpoint
- **File Import / Export** — Bulk data ingestion from Excel/CSV and file upload support
- **Inbound Webhooks** — `/api/inbound` endpoint to receive external data and trigger internal flows
- **Alert Rules** — Configurable alert thresholds linked to KPI actuals
- **Settings & Properties** — App-wide configurable settings and entity property management
- **Health Check Endpoint** — `/api/health` for uptime monitoring and deployment verification
- **MCP Server** — A dedicated Model Context Protocol server for AI assistant integration
- **Arabic-Friendly Data** — The data layer and UI are designed to handle Arabic text natively

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| State Management | Zustand |
| Server State / Fetching | React Query (TanStack Query) |
| Forms & Validation | React Hook Form + Zod |
| ORM | Prisma |
| Local DB | SQLite |
| Production DB | Cloudflare D1 |
| Deployment Runtime | Cloudflare Workers via OpenNext |
| Package Manager | Bun |
| Email | Resend |
| Messaging | Telegram Bot API |
| CI/CD | GitHub Actions |

---

## Project Structure

```text
tasktracker/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions → Cloudflare deploy pipeline
├── .claude/                        # Claude AI assistant context files
├── .dry-run-output/                # Output from deployment dry-run tests
├── .open-next/                     # OpenNext build artifacts
├── .zscripts/                      # Internal utility scripts
├── download/                       # Directory for exported/downloadable files
├── examples/                       # Example data files for import testing
├── mcp-server/                     # Model Context Protocol server
│   └── index.ts                    # MCP server entrypoint
├── migrations/                     # D1 SQL migration files
├── mini-services/                  # Standalone microservice utilities
├── prisma/
│   └── schema.prisma               # Full data model definition
├── public/                         # Static assets (images, icons)
├── scripts/                        # Admin/setup scripts
├── skills/                         # AI skill definitions
├── src/
│   ├── app/
│   │   ├── (dashboard)/            # Dashboard route group (protected layout)
│   │   ├── api/                    # All Next.js API Route Handlers
│   │   │   ├── actuals/            # KPI actual values
│   │   │   ├── alerts/             # Alert configuration and triggers
│   │   │   ├── company/            # Company entity CRUD
│   │   │   ├── company-kpis/       # Company-level KPI definitions
│   │   │   ├── company-kpis-monthly/ # Monthly KPI snapshots
│   │   │   ├── cron/               # Scheduled job endpoint (CRON_SECRET protected)
│   │   │   ├── employee-custom-kpis/ # Custom KPI assignments per employee
│   │   │   ├── employee-positions/ # Position/role definitions
│   │   │   ├── employees/          # Employee CRUD
│   │   │   ├── employees-kpis/     # Employee KPI associations
│   │   │   ├── health/             # Health check endpoint
│   │   │   ├── import/             # Bulk data import handler
│   │   │   ├── inbound/            # External webhook receiver
│   │   │   ├── kpi-actuals/        # KPI actual entry management
│   │   │   ├── kpi-targets/        # KPI target management
│   │   │   ├── kpis/               # Core KPI definitions
│   │   │   ├── managers/           # Manager profile management
│   │   │   ├── notifications/      # Notification CRUD and dispatch
│   │   │   ├── properties/         # Entity properties/custom fields
│   │   │   ├── reminders/          # Reminder scheduling and management
│   │   │   ├── send-reminder-email/# Email send trigger
│   │   │   ├── settings/           # App settings management
│   │   │   ├── targets/            # Performance targets
│   │   │   ├── tasks/              # Core task CRUD
│   │   │   ├── telegram/           # Telegram bot webhook
│   │   │   ├── upload/             # File upload handler
│   │   │   └── users/              # User management
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Root redirect
│   ├── components/                 # Shared and domain-specific UI components
│   ├── hooks/                      # Custom React hooks
│   └── lib/                        # Core utilities: DB client, email helpers, validators
├── upload/                         # Incoming uploaded file storage
├── .env.example                    # Local environment variable template
├── .dev.vars.example               # Wrangler local env template
├── next.config.ts                  # Next.js configuration
├── open-next.config.ts             # OpenNext Cloudflare adapter config
├── wrangler.jsonc                  # Cloudflare Worker + D1 binding config
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

---

## Data Model

The full schema lives in [`prisma/schema.prisma`](./prisma/schema.prisma). The core entities are:

| Entity | Description |
|---|---|
| `Task` | Core work item with title, status, priority, deadline, and assignee |
| `Employee` | Staff profile linked to positions and managers |
| `Manager` | Supervisory role with assignment relationships |
| `EmployeePosition` | Job role/title taxonomy |
| `Company` | Business entity for grouping KPIs and employees |
| `KPI` | Key performance indicator definition |
| `KpiTarget` | Target value for a KPI within a time period |
| `KpiActual` | Recorded actual value for a KPI |
| `CompanyKpi` | Company-level KPI association |
| `CompanyKpiMonthly` | Monthly rollup of company KPI data |
| `EmployeeKpi` | Employee-level KPI assignment |
| `EmployeeCustomKpi` | Bespoke KPI defined for a specific employee |
| `Notification` | In-app notification record |
| `Reminder` | Scheduled reminder with recurrence rules |
| `Alert` | Threshold-based alert configuration |
| `Settings` | Global app configuration store |
| `Property` | Dynamic property/custom field definitions |
| `User` | Application user with role and auth context |

---

## API Surface

All endpoints live under `/api/`. Every route follows REST conventions.

| Endpoint | Method(s) | Purpose |
|---|---|---|
| `/api/health` | GET | System health check |
| `/api/tasks` | GET, POST | List and create tasks |
| `/api/tasks/[id]` | GET, PATCH, DELETE | Single task operations |
| `/api/employees` | GET, POST | Employee management |
| `/api/employees/[id]` | GET, PATCH, DELETE | Single employee |
| `/api/managers` | GET, POST | Manager management |
| `/api/kpis` | GET, POST | KPI definitions |
| `/api/kpi-targets` | GET, POST | Set KPI targets |
| `/api/kpi-actuals` | GET, POST | Record KPI actuals |
| `/api/company-kpis` | GET, POST | Company KPI links |
| `/api/company-kpis-monthly` | GET, POST | Monthly KPI snapshots |
| `/api/employees-kpis` | GET, POST | Employee KPI links |
| `/api/employee-custom-kpis` | GET, POST | Custom employee KPIs |
| `/api/notifications` | GET, POST, PATCH | Notifications |
| `/api/reminders` | GET, POST, DELETE | Reminder scheduling |
| `/api/alerts` | GET, POST, PATCH | Alert management |
| `/api/settings` | GET, PATCH | App settings |
| `/api/properties` | GET, POST | Custom properties |
| `/api/users` | GET, POST | User accounts |
| `/api/import` | POST | Bulk data import |
| `/api/upload` | POST | File upload |
| `/api/send-reminder-email` | POST | Trigger reminder email |
| `/api/cron` | GET | Cron job handler (secret protected) |
| `/api/inbound` | POST | External webhook receiver |
| `/api/telegram` | POST | Telegram bot webhook |

---

## Environment Setup

Copy the environment templates:

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

Required environment variables:

```env
# Database (local development only)
DATABASE_URL="file:./db/custom.db"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"

# Cron security
CRON_SECRET="replace-with-a-long-random-secret"
```

> **Important:** `.env` is consumed by Prisma and local Next.js. `.dev.vars` is consumed by Wrangler during local Cloudflare preview. **Never commit real secrets to Git.**

---

## Local Development

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Push schema to local SQLite
bun run db:push

# Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Management

### Prisma (Local SQLite)

```bash
# Regenerate Prisma client after schema changes
bun run db:generate

# Apply schema changes to local DB
bun run db:push

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

### Cloudflare D1 (Production)

Create the D1 database:

```bash
bunx wrangler d1 create tasktracker-db
```

Generate SQL migration from Prisma schema:

```bash
bunx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script \
  --output migrations/0001_initial_schema.sql
```

Apply migration locally (Wrangler emulator):

```bash
bunx wrangler d1 migrations apply tasktracker-db --local
```

Apply migration to production D1:

```bash
bunx wrangler d1 migrations apply tasktracker-db --remote
```

---

## Cloudflare Workers Deployment

### One-Time Setup

1. Create a D1 database and copy the returned ID into `wrangler.jsonc`
2. Generate and apply D1 migrations (see above)
3. Set production secrets in Cloudflare:

```bash
bunx wrangler secret put RESEND_API_KEY
bunx wrangler secret put FROM_EMAIL
bunx wrangler secret put ADMIN_EMAIL
bunx wrangler secret put CRON_SECRET
```

### Build and Deploy

Preview locally using Wrangler:

```bash
bun run preview
```

Deploy to Cloudflare:

```bash
bun run deploy
```

---

## CI/CD Pipeline

GitHub Actions is configured in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

Required GitHub repository secrets:

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Worker and D1 permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

On every push to `main`, the pipeline:

1. Installs dependencies with Bun
2. Generates the Prisma client
3. Builds the Next.js app via OpenNext
4. Deploys the Worker to Cloudflare

---

## Notification System

TaskTracker uses a dual-channel notification approach:

- **Email (Resend):** Triggered on task assignments, reminders, and alert breaches. Uses `FROM_EMAIL` and `ADMIN_EMAIL`.
- **Telegram:** A Telegram bot webhook at `/api/telegram` receives updates and can dispatch messages. Useful for real-time operational alerts.
- **Cron Job:** `/api/cron` is a scheduled endpoint protected by `CRON_SECRET`. Call it from Cloudflare Workers Cron Triggers or any external scheduler to process pending reminders and alerts.

---

## Import / Export

- **Import:** Send a `POST` to `/api/import` with your Excel/CSV payload. The handler parses, validates, and writes records to the database in bulk.
- **Export / Download:** The `download/` directory holds generated files. The frontend can trigger export and retrieve from this path.
- **Upload:** Binary file uploads go through `/api/upload` and are written to the `upload/` directory.

---

## MCP Server

The `mcp-server/` directory contains a [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes TaskTracker's data to AI assistants (e.g., Claude, Cursor). This enables natural language querying and task management directly from AI chat interfaces.

To run the MCP server independently:

```bash
cd mcp-server
bun install
bun run index.ts
```

---

## Production Checklist

- [ ] Update the D1 database ID in `wrangler.jsonc`
- [ ] Generate and apply D1 migrations
- [ ] Set all production secrets via Wrangler
- [ ] Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub repository secrets
- [ ] Push to `main` branch and verify GitHub Actions deployment
- [ ] Verify the Worker is live in the Cloudflare dashboard
- [ ] Configure Cloudflare Cron Trigger to call `/api/cron` on schedule
- [ ] Set up Telegram bot webhook pointing to `https://yourdomain.com/api/telegram`
- [ ] Test `/api/health` endpoint returns 200
- [ ] Confirm email delivery via Resend dashboard
