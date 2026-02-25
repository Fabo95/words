# Words - Vocabulary Learning App

A vocabulary learning application with spaced repetition, daily goals, and collections.

## Architecture Overview

This project consists of two repositories:

1. **This repository** (`words`) - pnpm monorepo with:
   - `services/web` - Next.js frontend
   - `services/inngest` - Background jobs and cron tasks

2. **Backend repository** (`/Users/fabianhinz/repositories/words-backend`) - Rust REST API

All services connect to the same PostgreSQL database.

---

## Frontend (`services/web`)

### Tech Stack

- **Framework**: Next.js 16 with App Router (standalone output)
- **React**: 19.x with TypeScript
- **State**: React Query (`@tanstack/react-query`) with `useSuspenseQuery` and `HydrationBoundary`
- **Forms**: React Hook Form + Zod validation (zodResolver)
- **UI**: Radix UI primitives + shadcn/ui components + Tailwind CSS 4
- **i18n**: next-intl with `de-DE` and `en-GB` locales
- **API**: openapi-fetch + openapi-react-query (types from backend OpenAPI spec)
- **Linting**: Biome (shared config in `packages/biome-config`)

### Project Structure

```
services/web/src/
├── app/
│   └── [lang]/
│       ├── (loggedOut)/     # Public routes (authentication)
│       └── (loggedIn)/      # Protected routes (home, collection, learning, etc.)
├── components/
│   ├── forms/               # Form components (see Forms pattern below)
│   ├── ui/                  # shadcn/ui + custom components
│   └── ...                  # Feature components
├── generated/
│   └── openApiTypes.ts      # Auto-generated from backend OpenAPI
├── hooks/                   # Custom React hooks
├── i18n/                    # next-intl configuration
└── utils/
    ├── api/                 # openapi-fetch setup
    └── reactQuery/          # Query options and helpers
```

### Key Patterns

#### Forms

Forms are organized in `src/components/forms/{formName}/`:

```
formName/
├── formName.tsx           # Form component ("use client")
└── utils/
    ├── formNameSchema.ts  # getFormNameSchema(t: TFunction) - Zod schema
    └── formNameTypes.ts   # Type inference from schema
```

Example:
```typescript
// formNameSchema.ts
export const getLoginFormSchema = (t: TFunction) => z.object({...})

// formNameTypes.ts
export type LoginFormState = z.infer<ReturnType<typeof getLoginFormSchema>>

// formName.tsx ("use client")
const form = useForm<LoginFormState>({
  resolver: zodResolver(getLoginFormSchema(t)),
  mode: "onChange"
})
```

#### React Query

- Query options: `src/utils/reactQuery/queryOptions.ts`
- Pattern: `export const getXQueryOptions = (...) => $api.queryOptions("method", "/path", {...})`
- Mutations: `$api.useMutation("post", "/path", { onSuccess, onError })`
- SSR: Use `HydrationBoundary` + `dehydrate(queryClient)` for prefetching
- **Important**: Do NOT add headers in query options (breaks SSR hydration)

#### Internationalization

- Locales: `de-DE` and `en-GB`
- Files: `messages/{locale}.json`
- Structure: `forms.{formName}.*`, `components.{componentName}.*`, `pages.{pageName}.*`
- **Always update both locale files** when adding new keys

#### Authentication

- Cookie-based auth via `auth-cookie`
- Middleware injects auth automatically
- Route groups: `(loggedOut)` for public, `(loggedIn)` for protected

### Commands

```bash
pnpm dev                    # Dev server (localhost:3000)
pnpm build                  # Production build
pnpm open_api:generate      # Regenerate API types (requires backend on localhost:8080)
pnpm lint                   # Biome linting
```

---

## Background Jobs (`services/inngest`)

### Tech Stack

- **Runtime**: Fastify + Inngest
- **Database**: Prisma (same PostgreSQL as backend)
- **DI**: Awilix for dependency injection

### Key Locations

- Cron functions: `src/utils/inngest/functions/cronFunctions/`
- Model services: `src/services/model/`

### Guidelines

- Use `updateMany` for batch operations, not loops with individual updates
- All timestamps should be timezone-aware (UTC)

### Commands

```bash
pnpm dev                    # Dev server
pnpm prisma:pull            # Pull schema from database
pnpm prisma:generate        # Generate Prisma client
```

---

## Backend (`/Users/fabianhinz/repositories/words-backend`)

### Tech Stack

- **Language**: Rust with Tokio async runtime
- **Framework**: Axum 0.8.x with tower middleware
- **Database**: PostgreSQL via SeaORM 2.x
- **API Docs**: Utoipa (OpenAPI) with Swagger UI
- **Auth**: HMAC-SHA512 tokens + Argon2 password hashing
- **External**: Inngest (background jobs), DeepL (translations)

### Workspace Structure

```
words-backend/
├── crates/
│   ├── entity/              # ⚠️ AUTO-GENERATED - SeaORM models
│   ├── migration/           # Database migrations
│   ├── libs/
│   │   ├── lib-utils/       # Utilities (hashing, pagination, time)
│   │   ├── lib-db/          # DB manager, config, context
│   │   ├── lib-cookie/      # Auth tokens and cookies
│   │   └── open_api/        # OpenAPI specification
│   └── services/
│       └── web-server/      # Main Axum application
└── scripts/
    └── generate_entities.sh # Entity generation script
```

### ⚠️ Entity Generation

The `crates/entity/` directory is **auto-generated** from the database schema. **Never edit manually**.

To regenerate after schema changes:
```bash
cd /Users/fabianhinz/repositories/words-backend/scripts
./generate_entities.sh
```

### Architecture Pattern

```
web-server/
├── main.rs                  # Entry point, middleware setup
└── web/
    ├── controller/          # Business logic per domain
    ├── routes/              # HTTP handlers + OpenAPI annotations
    ├── middleware_auth.rs   # Authentication middleware
    └── error.rs             # Unified error handling
```

**Controller Pattern**:
- Each domain (User, Translation, Collection, Learn) has a `{Domain}Controller`
- Input types: `{Domain}ForCreate`, `{Domain}ForUpdate`
- Output wrapped in `HttpResponseBody<T>`

**Error Handling**:
- Hierarchical errors: `web::error::Error` → `controller::Error` → `manager::Error`
- Auto-converts to HTTP status codes via `IntoResponse`

### Key Crates

| Crate | Purpose |
|-------|---------|
| `entity` | SeaORM models (auto-generated) |
| `migration` | Database schema migrations |
| `lib-utils` | Hashing, pagination, time utilities |
| `lib-db` | `Manager` struct providing db/inngest/deepl access |
| `lib-cookie` | Token generation and validation |
| `web-server` | Axum application with routes and controllers |

### Manager Pattern

Central access point for external services:
```rust
pub struct Manager {
    db: DbConnection,
    inngest_client: InngestHttpClient,
    deepl_client: DeepLClient,
}
```
Injected via `State<Arc<Manager>>` in handlers.

### Authentication Flow

1. Login: Password verified with Argon2
2. Token format: `base64_identifier.base64_expiration.hmac_signature`
3. Token stored in HTTP-only `auth-cookie`
4. Middleware validates token and injects `Ctx` (user_id)

### Commands

```bash
cargo run -p web-server                  # Run dev server (localhost:8080)
sea-orm-cli migrate up                   # Run migrations
sea-orm-cli migrate generate <NAME>      # Create new migration
./scripts/generate_entities.sh           # Regenerate entity models
```

### Environment Variables

Set in `.cargo/config.toml`:
```
SERVICE_DB_URL=postgres://root:password@localhost:5432
SERVICE_DB_NAME=words
SERVICE_PORT=8080
SERVICE_ALLOW_ORIGIN=http://localhost:3000
SERVICE_TOKEN_SECRET_KEY=...
SERVICE_TOKEN_DURATION_SEC=1800
INNGEST_BASE_URL=http://localhost:8288
INNGEST_EVENT_KEY=local
DEEPL_API_KEY=...
```

---

## Root Commands

```bash
pnpm dev                    # Start all services (docker + web + inngest)
pnpm build                  # Build all services
pnpm lint                   # Lint all services
```

---

## Code Style

### Frontend (TypeScript)

- Linting: Biome (tabs, 120 char lines, double quotes)
- Components: `const` arrow functions
- Client components: `"use client"` directive required
- Path alias: `@app/*` → `src/*`

### Backend (Rust)

- Async: All I/O operations use `async`/`.await`
- Error handling: Use `?` operator, hierarchical error types
- Types: Wrapper types for IDs, derive Serde + Validate + Utoipa on DTOs
- Modules: Controller (logic) vs Routes (HTTP bindings) separation

---

## Implementation Guidelines

1. **Full implementation**: Complete all related components (frontend, backend, cron jobs)
2. **Batch operations**: Use `updateMany` instead of loops
3. **Timestamps**: Always timezone-aware (UTC)
4. **API types**: Regenerate after backend changes (`pnpm open_api:generate`)
5. **Entity models**: Regenerate after migrations (`./generate_entities.sh`)
6. **i18n**: Update both `de-DE.json` and `en-GB.json`
