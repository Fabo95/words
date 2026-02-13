# Words - Vocabulary Learning App

A vocabulary learning application with spaced repetition, daily goals, and collections.

## Architecture

This is a **pnpm monorepo** with two services:

- `services/web` - Next.js frontend (React 19, TypeScript)
- `services/inngest` - Background jobs and cron tasks (Fastify, Inngest, Prisma)

The **Rust backend** lives in a separate repository (`words-backend`).

## Tech Stack

### Frontend (`services/web`)

- **Framework**: Next.js 16 with App Router
- **State**: React Query (`@tanstack/react-query`) with `useSuspenseQuery`
- **Forms**: React Hook Form + Zod validation
- **UI**: Radix UI primitives + shadcn/ui components + Tailwind CSS 4
- **i18n**: next-intl with `de-DE` and `en-GB` locales
- **API**: openapi-fetch + openapi-react-query (types generated from backend OpenAPI spec)

### Background Jobs (`services/inngest`)

- **Runtime**: Fastify + Inngest
- **Database**: Prisma (connects to same PostgreSQL as backend)
- **DI**: Awilix for dependency injection

## Key Patterns

### Forms

Forms are organized in `services/web/src/components/forms/{formName}/`:
```
formName/
├── formName.tsx           # Form component
└── utils/
    ├── formNameSchema.ts  # Zod schema (getDailyGoalsFormSchema)
    └── formNameTypes.ts   # TypeScript types
```

### Translations

- Files: `services/web/messages/{locale}.json`
- Structure: `forms.{formName}.*`, `components.{componentName}.*`, `pages.{pageName}.*`
- Always update both `de-DE.json` and `en-GB.json`

### React Query

- Query options defined in `services/web/src/utils/reactQuery/queryOptions.ts`
- Pattern: `export const getXQueryOptions = (authCookieValue?: string) => $api.queryOptions(...)`
- Mutations use `$api.useMutation("method", "/path")`

### API Types

Generated from backend OpenAPI spec:
```bash
cd services/web
pnpm open_api:generate  # Requires backend running on localhost:8080
```

### Inngest Cron Jobs

- Located in `services/inngest/src/utils/inngest/functions/cronFunctions/`
- Model services in `services/inngest/src/services/model/`
- Use `updateMany` for batch operations, not loops with individual updates

## Common Commands

```bash
# Root
pnpm dev                    # Start all services (docker + web + inngest)

# Frontend
cd services/web
pnpm dev                    # Dev server
pnpm build                  # Production build
pnpm open_api:generate      # Regenerate API types

# Inngest
cd services/inngest
pnpm dev                    # Dev server
pnpm prisma:pull            # Pull schema from database
pnpm prisma:generate        # Generate Prisma client
```

## Code Style

- Linting: Biome (shared config in `packages/biome-config`)
- Use tabs for indentation
- Prefer `const` arrow functions for components
- Client components need `"use client"` directive

## Implementation Guidelines

- When implementing features, complete the full implementation including any related cron jobs or background tasks
- For multi-component work (frontend + backend), outline all components at the start
- Use `updateMany` for batch database operations instead of loops
- All timestamps should be timezone-aware (UTC)
