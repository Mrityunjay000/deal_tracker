# Deal Tracker — Monorepo Overview

A lightweight deal-pipeline dashboard for a pre-sales engineer. Deal data lives in plain `.md` files with YAML frontmatter. A Python API parses and serves them; a React app renders the dashboard. No database.

## Monorepo Layout

```
deal_tracker/
├── backend/       # FastAPI — parses .md files, serves REST + SSE
├── frontend/      # React + TypeScript + Vite — dashboard UI
├── deals/         # Your .md deal files (the source of truth)
└── docs/          # Architecture docs and next-steps
```

## How to Run

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set DEALS_DIR if your deals folder is elsewhere
uvicorn main:app --reload
# API at http://localhost:8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# UI at http://localhost:5173
```

## Deal File Format

Files live in `./deals/*.md`. Each file is one deal.

```markdown
---
title: Acme Corp - Enterprise Platform
company: Acme Corp
contact: Jane Smith
stage: proposal          # see valid stages below
value: 85000             # numeric, USD
probability: 65          # 0–100
close_date: 2026-08-15   # YYYY-MM-DD
created: 2026-04-01
tags: [enterprise, manufacturing]
---

Free-form markdown notes go here.
```

**Valid stages:** `discovery` → `qualification` → `demo` → `proposal` → `negotiation` → `closed-won` / `closed-lost`

## Data Flow

```
deals/*.md  →  backend/parser.py  →  FastAPI /deals  →  React useDeals hook  →  UI
                     ↑
              watchdog watches for
              file saves and pushes
              SSE events to frontend
```

The SSE stream at `/stream` means the dashboard auto-refreshes whenever you save a deal file — no manual reload needed.

## See Also

- `backend/CLAUDE.md` — backend architecture details
- `frontend/CLAUDE.md` — frontend component structure
- `docs/architecture.md` — full architecture rationale
- `docs/next-steps.md` — roadmap and extension ideas
- `docs/deal-format.md` — deal file format specification
