# 🧠 TaskTracker — Application Algorithm & Logic Brain

> This document is the definitive reference for how TaskTracker thinks, processes data, and makes decisions. It describes every major algorithmic flow, state machine, and data processing pipeline in the system. If you are extending the app, debugging unexpected behavior, or onboarding a new developer, start here.

---

## Table of Contents

1. [Architecture Mental Model](#1-architecture-mental-model)
2. [Request Lifecycle](#2-request-lifecycle)
3. [Task State Machine](#3-task-state-machine)
4. [KPI Evaluation Engine](#4-kpi-evaluation-engine)
5. [Notification & Alerting Pipeline](#5-notification--alerting-pipeline)
6. [Cron Job Logic](#6-cron-job-logic)
7. [Import Processing Algorithm](#7-import-processing-algorithm)
8. [Authentication & Authorization Model](#8-authentication--authorization-model)
9. [Data Consistency Rules](#9-data-consistency-rules)
10. [MCP Server Logic](#10-mcp-server-logic)
11. [Telegram Bot Flow](#11-telegram-bot-flow)
12. [Error Handling Philosophy](#12-error-handling-philosophy)

---

## 1. Architecture Mental Model

TaskTracker is a **server-first, edge-deployed** application. Understanding where code runs is the foundation of understanding the system.

```
┌─────────────────────────────────────────────────────┐
│                  BROWSER (Client)                   │
│  React components, React Query cache, Zustand store │
│  → Fetches data via /api/* routes                   │
└────────────────────────┬────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────┐
│           CLOUDFLARE WORKER (Edge Runtime)          │
│  Next.js App Router via OpenNext adapter            │
│  → Handles all pages and API Route Handlers         │
│  → Connects to D1 via the DB binding                │
└────────────────────────┬────────────────────────────┘
                         │ D1 SQL binding
┌────────────────────────▼────────────────────────────┐
│              CLOUDFLARE D1 (SQLite at edge)         │
│  Authoritative data store                           │
│  Accessed via Prisma (local) or raw D1 binding      │
└─────────────────────────────────────────────────────┘
```

**Local development** replaces D1 with a local SQLite file (`db/custom.db`) via Prisma. The database access layer in `src/lib/` abstracts this so business logic does not change between environments.

---

## 2. Request Lifecycle

Every API request flows through the following stages:

```
Incoming HTTP Request
        │
        ▼
[1] Next.js Route Handler matched (src/app/api/*/route.ts)
        │
        ▼
[2] Request parsing
    - JSON body parsed
    - Query params extracted
    - Headers inspected (auth token, cron secret)
        │
        ▼
[3] Input validation (Zod schema)
    - If invalid → 400 Bad Request with field errors
    - If valid → continue
        │
        ▼
[4] Authorization check
    - Public endpoints: skip
    - Protected endpoints: verify token/session
    - Cron endpoint: verify CRON_SECRET header
        │
        ▼
[5] Business logic execution
    - DB read/write via Prisma (local) or D1 (production)
    - Side effects: notifications, email triggers, etc.
        │
        ▼
[6] Response serialization
    - 200/201 with JSON payload
    - 400/401/403/404/500 with error object
        │
        ▼
HTTP Response returned to client
```

**Client-side**, React Query manages caching and re-fetching. After a mutation (POST/PATCH/DELETE), the query client invalidates the relevant query key, causing the UI to re-fetch fresh data automatically.

---

## 3. Task State Machine

Tasks are the primary work unit. A task transitions through states according to the following machine:

```
         ┌──────────────────┐
         │     PENDING       │  ← Initial state on creation
         └────────┬─────────┘
                  │ Assigned / Started
                  ▼
         ┌──────────────────┐
         │   IN_PROGRESS    │
         └────────┬─────────┘
                  │
         ┌────────┴─────────┐
         │                  │
         ▼                  ▼
  ┌─────────────┐    ┌─────────────┐
  │  COMPLETED  │    │   BLOCKED   │
  └──────┬──────┘    └──────┬──────┘
         │                  │ Blocker resolved
         │                  ▼
         │           ┌─────────────┐
         │           │ IN_PROGRESS │ (re-entered)
         │           └─────────────┘
         ▼
  ┌─────────────┐
  │  ARCHIVED   │  ← Soft-deleted / closed
  └─────────────┘
```

### State Transition Rules

| From | To | Allowed | Trigger |
|---|---|---|---|
| PENDING | IN_PROGRESS | ✅ | User starts task or assigns it |
| IN_PROGRESS | COMPLETED | ✅ | User marks done |
| IN_PROGRESS | BLOCKED | ✅ | User flags a blocker |
| BLOCKED | IN_PROGRESS | ✅ | Blocker is resolved |
| COMPLETED | ARCHIVED | ✅ | Admin or system cleanup |
| COMPLETED | IN_PROGRESS | ✅ | Reopened (e.g., feedback required) |
| Any | PENDING | ❌ | Cannot revert to initial state |

### Priority Levels

Tasks carry a `priority` field: `LOW` → `MEDIUM` → `HIGH` → `CRITICAL`. Priority does not affect state but influences sort order on dashboards and notification urgency.

---

## 4. KPI Evaluation Engine

The KPI system operates on a **target vs. actual** model. The evaluation engine computes performance scores and determines alert conditions.

### KPI Hierarchy

```
KPI Definition (name, unit, direction)
    ├── KpiTarget       (period, value)
    ├── KpiActual       (period, recorded value)
    ├── CompanyKpi      (links KPI → Company)
    │     └── CompanyKpiMonthly  (monthly snapshot)
    └── EmployeeKpi     (links KPI → Employee)
          └── EmployeeCustomKpi (bespoke per-employee variant)
```

### Performance Score Calculation

For a given KPI in a period:

```
If direction = HIGHER_IS_BETTER:
  score = (actual / target) × 100

If direction = LOWER_IS_BETTER:
  score = (target / actual) × 100

Score is clamped: max 100 (or optionally uncapped for stretch goals)
```

### Company KPI Monthly Achievement — Cumulative Formula

For **Company KPIs** with monthly data entry, achievement is computed using a
**cumulative annual formula**, not a pro-rated monthly slice:

```
achievement = (totalActual / annualTarget) × 100
```

Where `totalActual` is the sum of all months entered so far for the year.

**Why cumulative, not pro-rated?**

The previous implementation used a pro-rated target:
```
proRateTarget = (annualTarget / 12) × monthsEntered
achievement   = totalActual / proRateTarget × 100
```

This is mathematically incorrect for cumulative KPIs (Revenue, Net Profit, etc.).
Example: Annual target = 100M. Jan actual = 10M, Feb actual = 7M.

| Formula | Result | Interpretation |
|---|---|---|
| Pro-rated (old) | 17M / 16.67M = **102%** | False over-achievement signal |
| Cumulative (new) | 17M / 100M = **17%** | Correct year-to-date progress |

The cumulative formula is implemented in the `calcAchievement()` utility function
in `src/components/sections/company-kpis-section.tsx` and applied consistently
across individual KPI cards, the weighted overall banner, and per-category summaries.

The 150% cap is retained to prevent extreme outliers from distorting the UI progress bar.

### Alert Thresholds

Each alert record defines:
- `kpi_id` — which KPI to watch
- `threshold` — the score value (e.g., 70)
- `operator` — `BELOW` or `ABOVE`
- `channel` — `EMAIL`, `TELEGRAM`, or `BOTH`

The evaluation loop (run by the cron job) checks every active alert against current actuals and fires the notification if the condition is met.

---

## 5. Notification & Alerting Pipeline

```
 Trigger Source
      │
      ├── Task due soon (cron)
      ├── KPI threshold breached (cron evaluation)
      ├── Manual user action (UI → POST /api/notifications)
      └── Inbound webhook (POST /api/inbound)
            │
            ▼
    [Notification Record Created]
      - Saved to DB with status = PENDING
            │
            ▼
    [Dispatch Decision]
      - Read notification.channel
      │
      ├── EMAIL → POST /api/send-reminder-email
      │         → Calls Resend API with template
      │         → On success: status = SENT
      │         → On failure: status = FAILED, log error
      │
      └── TELEGRAM → POST /api/telegram (outbound)
                  → Calls Telegram Bot sendMessage API
                  → On success: status = SENT
```

### Notification Status Lifecycle

`PENDING` → `SENT` → (optional) `READ`
`PENDING` → `FAILED` → (retry on next cron cycle)

---

## 6. Cron Job Logic

The cron endpoint (`GET /api/cron`) is the system's heartbeat. It is protected by the `CRON_SECRET` header and should be called on a schedule (e.g., every hour via Cloudflare Cron Triggers).

### Execution Sequence

```
[1] Verify CRON_SECRET header
      └── If invalid → 401 Unauthorized, stop

[2] Process Pending Reminders
      - Query all Reminder records where nextRunAt <= NOW and active = true
      - For each:
          a. Create a Notification record
          b. Dispatch via configured channel (email / Telegram)
          c. Update nextRunAt based on recurrence rule
          d. If one-time: set active = false

[3] Evaluate KPI Alerts
      - Query all active Alert records
      - For each alert:
          a. Fetch latest KpiActual for the period
          b. Fetch KpiTarget for the same period
          c. Compute score
          d. Evaluate threshold condition
          e. If breached and not already notified this period:
              → Create Notification record
              → Dispatch
              → Record lastFiredAt = NOW

[4] Task Deadline Check
      - Query tasks where deadline is within 24 hours and status != COMPLETED
      - For each: create a due-soon notification if not already sent

[5] Return 200 OK with summary counts
```

---

## 7. Import Processing Algorithm

The `POST /api/import` endpoint handles bulk data ingestion.

```
Receive multipart/form-data or JSON payload
        │
        ▼
[1] Detect file type
    - .xlsx / .xls → parse with Excel parser
    - .csv → parse with CSV parser
    - .json → parse directly
        │
        ▼
[2] Map columns to schema fields
    - Column headers matched against known field names
    - Arabic column names supported via alias map
    - Unrecognized columns → warning (not fatal)
        │
        ▼
[3] Row-level validation (Zod)
    - Each row validated independently
    - Invalid rows collected → returned as errors
    - Valid rows proceed
        │
        ▼
[4] Duplicate detection
    - Check each row against existing DB records
    - Strategy: skip duplicates (default) or overwrite (if flag set)
        │
        ▼
[5] Batch insert
    - Valid, non-duplicate rows inserted in a single transaction
    - On DB error: full rollback
        │
        ▼
[6] Response
    - { inserted: N, skipped: M, errors: [...] }
```

---

## 8. Authentication & Authorization Model

TaskTracker uses a lightweight auth model suitable for internal operational tools:

- **User accounts** are stored in the `User` table with hashed passwords and role fields.
- **Session/token** management is handled at the middleware layer.
- **Role-based access** controls which endpoints a user can reach:

| Role | Access Level |
|---|---|
| `ADMIN` | Full access: all CRUD, settings, user management |
| `MANAGER` | Read all, write tasks/KPIs for assigned employees |
| `EMPLOYEE` | Read own data, update own task status |
| `VIEWER` | Read-only across the system |

- **Cron endpoint** is not user-role-protected — it uses a separate `CRON_SECRET` token in the request header.
- **Inbound webhook** uses a shared secret or IP allowlist (configurable in settings).

---

## 9. Data Consistency Rules

These invariants must always hold:

1. **A Task must have at least one assignee** — tasks cannot exist in a vacuum; they must reference an Employee or User.
2. **KpiActual period must match a KpiTarget period** — actuals without a corresponding target are accepted but will produce a `NO_TARGET` evaluation state (not a score).
3. **CompanyKpiMonthly is derived, not primary** — monthly snapshots are computed from KpiActuals; direct modification should be avoided.
4. **Notification records are immutable after SENT** — once dispatched, a notification is never edited; if resend is needed, a new record is created.
5. **Soft deletes preferred** — entities use an `archivedAt` or `active` flag rather than hard deletion to preserve audit trail.
6. **Employee-Manager relationship is single-parent** — an employee has exactly one direct manager at any time (managed by position records).

---

## 10. MCP Server Logic

The `mcp-server/` implements a [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes TaskTracker data as tools and resources for AI assistants.

### Exposed Tools

| Tool Name | Description |
|---|---|
| `list_tasks` | Fetch tasks with optional filters (status, priority, assignee) |
| `get_task` | Retrieve a single task by ID |
| `create_task` | Create a new task via natural language input |
| `update_task_status` | Transition a task to a new state |
| `list_kpis` | Get all KPI definitions |
| `get_kpi_performance` | Compute and return score for a KPI in a period |
| `list_employees` | Fetch employee list |
| `get_notifications` | Retrieve recent notifications |

### MCP Request Flow

```
AI Assistant sends MCP tool call
        │
        ▼
MCP Server receives → validates tool name and params
        │
        ▼
Calls internal TaskTracker API (or directly queries DB)
        │
        ▼
Formats response as MCP tool result
        │
        ▼
Returns structured JSON to AI assistant
```

---

## 11. Telegram Bot Flow

TaskTracker integrates with Telegram for bidirectional messaging.

### Inbound (User → Bot → System)

```
User sends message to Telegram Bot
        │
        ▼
Telegram calls POST /api/telegram (webhook)
        │
        ▼
[1] Parse update object (message, callback_query, etc.)
[2] Identify command:
    - /tasks → return today's open tasks
    - /kpi [name] → return latest KPI score
    - /done [task_id] → mark task as COMPLETED
    - /remind [text] [time] → create a reminder
    - Unknown → reply with help text
[3] Execute command against DB
[4] Send reply via Telegram sendMessage API
```

### Outbound (System → Bot → User)

The notification dispatcher calls the Telegram API directly with `chat_id` resolved from the employee/user record.

---

## 12. Error Handling Philosophy

TaskTracker follows a **fail-loudly on development, fail-gracefully on production** principle.

### API Layer

- All errors return a structured JSON body: `{ error: string, details?: any }`
- HTTP status codes are semantically correct (400 for bad input, 401 for auth, 404 for not found, 500 for server errors)
- Unhandled errors bubble to a global error handler that logs and returns 500

### Cron & Async Jobs

- Each step in the cron sequence is wrapped in try/catch
- A failure in one step (e.g., sending one email) does not abort the entire job
- Failed notifications are marked `FAILED` and retried on the next cron cycle
- After 3 consecutive failures for the same notification, it is marked `DEAD` and removed from the retry queue

### Import Processing

- Row-level errors do not abort the batch; they are collected and returned
- DB-level errors (constraint violations, write failures) trigger a full rollback
- The response always tells the caller exactly what happened: inserted, skipped, failed rows

### Client-Side

- React Query's `onError` callbacks surface errors in toast notifications
- Form validation errors (Zod) are shown inline per field
- Network failures show a retry prompt rather than a blank screen

---

*Last updated: April 2026 — maintained alongside `README.md` as a living document.*
