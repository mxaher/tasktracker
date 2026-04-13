# TaskTracker - Deployment Guide

A comprehensive Task Tracking Web Application built with Next.js 16.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

The easiest way to deploy this application:

1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

**Note**: SQLite works locally but for production on Vercel, use:
- Vercel Postgres
- Neon PostgreSQL
- Supabase

### Option 2: Cloudflare Pages

⚠️ **Important**: SQLite database won't work on Cloudflare. You need to:

1. **Use Cloudflare D1** (Cloudflare's SQLite-compatible database)
2. **Or use Turso** (libSQL)
3. **Or use a remote database** (Neon, Supabase, PlanetScale)

#### Steps for Cloudflare Deployment:

```bash
# Install Cloudflare adapter
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create tasktracker-db

# Update wrangler.toml with your database ID

# Build and deploy
npm run build
wrangler pages deploy
```

#### Update Prisma for D1:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_URL")
}
```

### Option 3: Docker/VPS

1. Build Docker image
2. Run with SQLite or connect to external database
3. Deploy to any VPS

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Option 4: Railway/Render/PlanetScale

1. Connect GitHub repository
2. Set environment variables
3. Use their managed database services

## 📦 Database Migration for Production

### Using Prisma with PostgreSQL (Recommended)

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `DATABASE_URL` in production:
```
DATABASE_URL="postgresql://user:password@host:5432/tasktracker"
```

3. Run migration:
```bash
npx prisma migrate deploy
```

### Using Turso (for Cloudflare/Edge)

1. Install Turso CLI
2. Create database
3. Update connection string

## 🔧 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email notifications (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

## 📝 Current Configuration

- **Framework**: Next.js 16 with App Router
- **Database**: SQLite (Prisma ORM)
- **UI**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js v4

## 🔄 Switching Databases

The application uses Prisma ORM, making it easy to switch databases:

1. **SQLite** (current) - Good for development/local
2. **PostgreSQL** - Recommended for production
3. **MySQL** - Alternative for production
4. **Cloudflare D1** - For Cloudflare deployment

Just update the `provider` in `prisma/schema.prisma` and the `DATABASE_URL` environment variable.

## 🛠️ Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Database operations
npm run db:push    # Push schema changes
npm run db:generate # Generate Prisma client
```

## ☁️ Cloudflare-Specific Notes

For Cloudflare Pages/Workers deployment:

1. **Database**: Must use D1, Turso, or remote database
2. **API Routes**: Work as Cloudflare Functions
3. **Static Assets**: Served from CDN
4. **Environment**: Edge runtime (limited Node.js APIs)

### Recommended Stack for Cloudflare:

- **Frontend**: Cloudflare Pages
- **Database**: Cloudflare D1 or Turso
- **Auth**: Clerk or Auth.js with edge-compatible adapter
- **Email**: Resend API (serverless-friendly)
