# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
pnpm

# Run development server (starts both Vite and Wrangler concurrently)
export VITE_LIVESTORE_SYNC_URL='http://localhost:8787'
pnpm dev
```

### Build
```bash
# Production build
pnpm build

# Build with bundle analysis
pnpm build:analyze
```

### Cloudflare Workers
```bash
# Deploy to Cloudflare Workers
pnpm wrangler:deploy

# Run Wrangler dev server only
pnpm dev:wrangler
```

## Architecture

Work Squared is a real-time collaborative web application built with:

- **LiveStore**: Event-sourced state management with SQLite materialized views
- **React 19** with TypeScript for the frontend
- **Cloudflare Workers** with Durable Objects for WebSocket-based real-time sync
- **SharedWorker** for multi-tab synchronization
- **OPFS** for client-side persistence

### Key Concepts

1. **Event Sourcing**: All state changes are events that get materialized into SQLite tables
   - Events are defined in `src/livestore/events.ts`
   - Schema and materializers in `src/livestore/schema.ts`
   - Queries in `src/livestore/queries.ts`

2. **Real-time Sync**: WebSocket server runs on Cloudflare Workers
   - Server implementation in `src/cf-worker/index.ts`
   - Client sync setup in `src/Root.tsx`

3. **State Management**: LiveStore provides reactive queries and event dispatch
   - Tables: `todos`, `chatMessages`, `uiState`
   - Events get synced across all connected clients
   - Local-first with automatic conflict resolution

### Directory Structure

- `/src/livestore/` - Data model (schema, events, queries)
- `/src/cf-worker/` - Cloudflare Worker for sync server
- `/src/components/` - React components
- `/src/livestore.worker.ts` - SharedWorker for LiveStore operations