# @words/app

## Overview

`@words/app` is a Next.js application that leverages modern web technologies for a fast and efficient user experience. It includes Radix UI components, TanStack Query for data fetching, and React Hook Form for form management. The project is configured with Biome for linting and formatting and uses `pnpm` as the package manager.

## Features

- **Next.js 15** for optimized React performance
- **Tailwind CSS** for styling
- **Radix UI** components for accessible and customizable UI elements
- **TanStack Query** for efficient data fetching and caching
- **Zod** for runtime validation and type safety
- **Biome** for code linting and formatting
- **pnpm** for fast and efficient package management

## Installation

Ensure you have `pnpm` installed globally:

```sh
npm install -g pnpm
```

Then, install the project dependencies:

```sh
pnpm install
```

## Development

To start the development server:

```sh
docker compose up -d
```

```sh
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Build and Production

To build the application:

```sh
pnpm build
```

To start the production server:

```sh
pnpm start
```

## Linting and Formatting

This project uses **Biome** for linting and formatting:

```sh
pnpm lint
```

Biome automatically ensures code quality and consistency.

## Project Structure

```
/ @words/app
├── /pages       # Next.js pages
├── /components  # Reusable UI components
├── /hooks       # Custom React hooks
├── /styles      # Tailwind CSS styles
├── /utils       # Utility functions
└── next.config.js  # Next.js configuration
```

## Configuration

The project includes custom configurations:
- `@words/biome-config` for Biome settings
- `@words/tailwind-config` for Tailwind configuration

---

For any questions, reach out to the project maintainers.