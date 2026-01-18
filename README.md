# Divyansh International

Premium B2B dry fruits and nuts platform built with Next.js 16, Sanity CMS, and
Prisma.

## Tech Stack

| Category   | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack) |
| Language   | TypeScript 5.9                     |
| CMS        | Sanity v5                          |
| Database   | PostgreSQL + Prisma 7              |
| Styling    | Tailwind CSS 4                     |
| Email      | Resend                             |
| Validation | Zod 4                              |

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
pnpm db:generate
pnpm db:push

# Seed CMS content
pnpm sanity:seed

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start dev server with Turbopack              |
| `pnpm build`       | Production build (type-check + lint + build) |
| `pnpm start`       | Start production server                      |
| `pnpm lint`        | Run ESLint                                   |
| `pnpm format`      | Format with Prettier                         |
| `pnpm type-check`  | TypeScript validation                        |
| `pnpm db:studio`   | Open Prisma Studio                           |
| `pnpm db:push`     | Push schema to database                      |
| `pnpm sanity:seed` | Seed Sanity CMS                              |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (website)/          # Public routes
│   ├── api/                # API routes
│   └── studio/             # Sanity Studio
├── components/             # React components
├── lib/                    # Utilities & clients
├── sanity/schemas/         # CMS schemas
└── prisma/                 # Database schema
```

## Environment Variables

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Database (Supabase/PostgreSQL)
DATABASE_URL=
DIRECT_URL=

# Email
RESEND_API_KEY=
CONTACT_EMAIL=

# Analytics (optional)
NEXT_PUBLIC_GA4_ID=
```

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

## License

Private - Divyansh International
