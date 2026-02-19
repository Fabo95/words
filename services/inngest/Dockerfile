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
# Prune stage - create a pruned monorepo for just the inngest service
# ============================================================================
FROM base AS pruner

WORKDIR /app

COPY . .

RUN turbo prune @words/inngest --docker

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

# Generate Prisma client for Linux Alpine
RUN cd services/inngest && npx prisma generate

# Build the application
RUN turbo build --filter=@words/inngest

# ============================================================================
# Production dependencies stage
# ============================================================================
FROM base AS prod-deps

WORKDIR /app

# Copy pruned lockfile and package.jsons
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies only
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ============================================================================
# Runner stage - production image
# ============================================================================
FROM node:22-alpine AS runner

WORKDIR /app/services/inngest

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 inngest

# Copy production node_modules
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/services/inngest/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/services/inngest/dist ./dist

# Copy Prisma schema and generated client
COPY --from=builder /app/services/inngest/prisma ./prisma
COPY --from=builder /app/services/inngest/src/generated ./src/generated

# Copy package.json for module resolution
COPY --from=builder /app/services/inngest/package.json ./

# Set ownership
RUN chown -R inngest:nodejs /app

# Switch to non-root user
USER inngest

# Expose port
EXPOSE 8086

ENV PORT=8086

# Start the application
CMD ["node", "./dist/index.js"]
