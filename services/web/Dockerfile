# syntax=docker/dockerfile:1

# ============================================================================
# Base image with pnpm
# ============================================================================
FROM node:22-alpine AS base

RUN apk update && apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm add -g turbo@^2

# ============================================================================
# Prune stage - create a pruned monorepo for just the web service
# ============================================================================
FROM base AS pruner

WORKDIR /app

COPY . .

RUN turbo prune @words/web --docker

# ============================================================================
# Installer stage - install dependencies
# ============================================================================
FROM base AS installer

WORKDIR /app

# Copy pruned lockfile and package.jsons
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ============================================================================
# Builder stage - build the application
# ============================================================================
FROM base AS builder

WORKDIR /app

# Copy installed dependencies
COPY --from=installer /app .

# Copy source code
COPY --from=pruner /app/out/full/ .

# Copy turbo config
COPY turbo.json turbo.json

# Build arguments for environment variables needed at build time
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_DEPLOYMENT_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_DEPLOYMENT_URL=$NEXT_PUBLIC_DEPLOYMENT_URL

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN turbo build --filter=@words/web

# ============================================================================
# Runner stage - production image
# ============================================================================
FROM node:22-alpine AS runner


WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/services/web/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/services/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/services/web/.next/static ./services/web/.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "services/web/server.js"]
