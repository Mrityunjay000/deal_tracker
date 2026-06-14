# Backend — Architecture

FastAPI service that parses `deals/*.md` files and exposes them over HTTP. Runs alongside a `watchdog` file watcher that pushes SSE events to connected frontend clients when files change.

## Key Files

| File | Role |
|---|---|
| `main.py` | FastAPI app, route handlers, SSE broadcast logic, lifespan startup/shutdown |
| `parser.py` | Reads a `.md` file with `python-frontmatter`, converts body to HTML via `markdown` |
| `watcher.py` | Watchdog observer that bridges the file-system thread to asyncio via `call_soon_threadsafe` |
| `config.py` | Reads `DEALS_DIR` and `PORT` from env / `.env` file |

## API Endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/deals` | `Deal[]` — all parsed deals |
| GET | `/deals/{id}` | `Deal` — single deal by file stem (e.g. `acme-corp`) |
| GET | `/stream` | SSE stream — emits `{"type":"reload"}` on any `.md` change |

## SSE Architecture

`watchdog` runs in its own OS thread. It posts events into `_change_queue` (an `asyncio.Queue`) via `loop.call_soon_threadsafe`. A single `broadcast_loop` coroutine fans each event out to per-connection subscriber queues. Each `/stream` connection drains its own queue. Connections clean up after themselves in a `finally` block.

A 30-second `asyncio.wait_for` timeout produces a `: keepalive\n\n` comment to keep the connection alive through proxies and load balancers.

## Deal Shape (Python dict)

```python
{
  "id": str,           # file stem, e.g. "acme-corp"
  "title": str,
  "company": str,
  "contact": str,
  "stage": str,        # see valid stages in root CLAUDE.md
  "value": float,
  "probability": int,  # 0–100
  "closeDate": str,    # ISO date string or ""
  "created": str,
  "tags": list[str],
  "notes": str,        # HTML rendered from markdown body
}
```

## Adding a New Field

1. Add the frontmatter key to your `.md` file(s).
2. Read it in `parser.py` → `parse_deal_file` and include it in the returned dict.
3. Add it to the `Deal` TypeScript interface in `frontend/src/types/deal.ts`.

## Running

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload   # dev — auto-reloads Python on save
python main.py              # prod-like, no auto-reload
```
