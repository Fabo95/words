# @words/root

## Overview

`@words/root` is a monorepo managed with `pnpm` workspaces. It provides a structured development environment for multiple packages and services. The workspace includes scripts for package synchronization, dependency management, and formatting.

## Features

- **pnpm workspaces** for efficient dependency management
- **Custom scripts** for maintaining and cleaning the workspace

## Installation

Ensure you have `pnpm` installed globally:

```sh
npm install -g pnpm
```

Then, install dependencies for all workspace packages:

```sh
pnpm install
```

## Workspace Structure

```
/ @words/root
├── /service       # Core service package
├── /packages      # Collection of sub-packages
│   ├── package-1  # Example package
│   ├── package-2  # Example package
└── package.json   # Root workspace configuration
```

## Scripts

### Sync Node Modules

Forces synchronization of `node_modules` in case of inconsistencies:

```sh
pnpm run packages:force-node-modules-sync
```

### Remove Node Modules

Removes all `node_modules` directories within the workspace:



