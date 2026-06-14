# Frontend — Architecture

React 18 + TypeScript + Vite single-page app. Tailwind CSS for styling, Recharts for charts. No router — the entire app is a single page with a tab switcher.

## Component Tree

```
App
├── Metrics          — summary strip (pipeline value, weighted forecast, win rate, …)
├── Tab switcher
├── Pipeline         — Kanban board grouped by stage
│   └── DealCard     — individual card (inline)
├── DealList         — sortable/filterable table
└── ForecastChart    — bar chart: pipeline vs. weighted by close month

DealDetail           — slide-in drawer, rendered on top of any tab
```

## Key Files

| File | Role |
|---|---|
| `src/App.tsx` | Root layout, tab state, selected-deal state |
| `src/hooks/useDeals.ts` | Fetches `/deals`, subscribes to `/stream` SSE, auto-refetches on change |
| `src/types/deal.ts` | `Deal` interface, `DealStage` union, `STAGES` array, `STAGE_COLORS` map |
| `src/components/Metrics.tsx` | Derived metrics from `Deal[]` |
| `src/components/Pipeline.tsx` | Kanban — iterates `STAGES`, filters deals per column |
| `src/components/DealList.tsx` | Table with search, stage filter, clickable sort headers |
| `src/components/DealDetail.tsx` | Slide-in drawer, renders `deal.notes` as raw HTML (from backend markdown) |
| `src/components/ForecastChart.tsx` | Groups by `closeDate.slice(0,7)`, renders Recharts `BarChart` |

## Data Flow

```
useDeals (fetch + SSE) → deals: Deal[] → props to Metrics / Pipeline / DealList / ForecastChart
                                       → selectedDeal → DealDetail drawer
```

## SSE Live Reload

`useDeals` opens an `EventSource` to `http://localhost:8000/stream`. On any `onmessage` event it re-calls `fetchDeals()`. The backend emits a message whenever a `.md` file is saved — so editing a deal file in your editor updates the dashboard immediately.

## Styling Conventions

- Tailwind utility classes only — no custom CSS except the `.prose` block in `index.css` for rendered markdown.
- Stage colors are centralized in `src/types/deal.ts → STAGE_COLORS` to keep them consistent across Pipeline, DealList, and DealDetail.

## Adding a New View / Tab

1. Create `src/components/MyView.tsx` accepting `deals: Deal[]`.
2. Add `{ key: 'myview', label: 'My View' }` to the `TABS` array in `App.tsx`.
3. Add `{tab === 'myview' && <MyView deals={deals} />}` in the render.

## Running

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build → dist/
```
