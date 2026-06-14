# Architecture

## Overview

Deal Tracker is a file-first dashboard. The authoritative data store is a folder of Markdown files — the same files you already write and edit. The application layer is read-only: it parses, aggregates, and visualizes without writing back.

```
┌─────────────────────────────────────────────────────┐
│  deals/*.md  (source of truth — edit in any editor) │
└──────────────────────────┬──────────────────────────┘
                           │ filesystem
                   ┌───────▼────────┐
                   │  watchdog       │  (OS thread)
                   │  observer       │
                   └───────┬────────┘
                           │ asyncio queue
                   ┌───────▼────────┐
                   │  FastAPI        │  :8000
                   │  GET /deals     │
                   │  GET /stream    │  SSE
                   └───────┬────────┘
                           │ HTTP / SSE
                   ┌───────▼────────┐
                   │  React SPA      │  :5173
                   │  useDeals hook  │
                   │  ├ Metrics      │
                   │  ├ Pipeline     │
                   │  ├ DealList     │
                   │  └ ForecastChart│
                   └────────────────┘
```

## Key Design Decisions

### Plain files as the data layer
No database is introduced. Files are portable, diffable with git, editable in any text editor, and trivially backed up. The trade-off is no multi-user write coordination — acceptable for a single-user tool.

### YAML frontmatter for structure, markdown body for prose
Separating machine-readable metadata (stage, value, probability) from free-form notes keeps files human-writable while giving the parser typed fields to aggregate. The `python-frontmatter` library handles this split cleanly.

### FastAPI over Flask/Django
FastAPI's async support is needed for the SSE endpoint. It also provides automatic OpenAPI docs at `/docs` for free, which is useful if you later want to script against the API.

### SSE over WebSockets
SSE is one-directional (server → client) and maps perfectly to the file-watch use case. It works natively with `EventSource` in the browser, requires no extra library, and automatically reconnects on disconnect. WebSockets would add complexity with no benefit here.

### Vite over Create React App
Faster cold starts, native ES module support, and first-class TypeScript handling. The dev server proxying is not needed because CORS is configured on the FastAPI side.

### Recharts over D3 / Chart.js
Recharts is React-native (components, not imperative canvas), ships with TypeScript types, and covers the charting needs here without the full weight of Chart.js or the complexity of D3.

## Thread / Async Boundary

`watchdog` operates on OS threads; FastAPI's event loop is asyncio. The bridge is `loop.call_soon_threadsafe(queue.put_nowait, event)` in `watcher.py`. A single `broadcast_loop` coroutine in `main.py` fans the single change queue out to per-connection subscriber queues, ensuring all connected browser tabs receive every change event.

## Security Boundary

The API is intentionally localhost-only (CORS restricted to `localhost:5173`). It serves files from a single directory and constructs paths as `DEALS_DIR / f"{deal_id}.md"` — no path traversal is possible because `deal_id` comes from a URL segment and is appended with a fixed `.md` suffix. The frontend renders `deal.notes` as raw HTML (from `dangerouslySetInnerHTML`) — this is safe because the HTML is generated server-side from your own markdown files, not from user input.
