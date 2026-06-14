# Next Steps & Extension Ideas

These are ordered roughly by effort and impact for a solo pre-sales engineer workflow.

---

## Near-term (low effort)

### Activity timeline
Show a chronological log of all deal updates across files. Since notes are freeform markdown, you'd parse bullet points that start with a date pattern (`- **Jun 10:**`) and render them as a unified timeline. No schema change needed.

### Tags filter
Extend the DealList filter bar with a multi-select tag filter. Tags are already parsed from frontmatter into `deal.tags`. You'd add a `Set<string>` filter state and union the active tag set against each deal.

### Close date urgency indicators
Highlight deals in the Pipeline board whose `close_date` is within 14 days. A simple `Date` comparison in the DealCard component — no backend change.

### Dark mode
Tailwind ships with `dark:` variant support. Add `darkMode: 'class'` to `tailwind.config.js` and a theme toggle button in the `App.tsx` header.

---

## Medium-term

### Git integration
If your `deals/` folder is a git repo, the backend could expose `GET /deals/{id}/history` using `git log --follow -p deals/{id}.md` to show change history per deal — useful for reconstructing how a deal evolved over time.

### Deal templates
A `templates/` folder with stage-specific `.md` skeletons (e.g. `qualification-template.md`). The frontend could offer a "New deal" button that writes a pre-filled file using the appropriate template. This requires the backend to accept a `POST /deals` endpoint that writes a file.

### CSV / Excel export
Add a `GET /deals.csv` endpoint in FastAPI that serializes the parsed deals list via Python's `csv` module. Useful for importing into CRM or sharing with your manager.

### Probability heatmap
A two-axis view: X = stage, Y = deal value range (buckets), colored by probability. Identifies high-value deals stuck in early stages. Implementable as a custom Recharts `ScatterChart`.

---

## Longer-term

### Search across notes
Full-text search across the markdown body of all deal files. Could be as simple as `grep` on the backend or as rich as integrating `whoosh` (pure Python full-text search) for indexed queries. Expose as `GET /deals?q=hipaa` and wire into the DealList search bar.

### CRM sync (HubSpot / Salesforce)
Add a background sync job (Python `schedule` or a cron) that reads deals from a CRM API and writes/updates `.md` files locally. This makes the dashboard a read-only view of your CRM's ground truth rather than a separate system. The reverse (pushing file changes back to the CRM) is possible but requires conflict resolution logic.

### Multi-user / shared deployment
Currently CORS is locked to localhost. To share the dashboard with your team:
1. Move `DEALS_DIR` to a shared NFS mount or S3-backed FUSE filesystem.
2. Open CORS to your internal domain.
3. Add basic auth (FastAPI's `HTTPBasic`) or put it behind an SSO proxy (e.g. Cloudflare Access).

### AI-assisted deal summaries
Add a `GET /deals/{id}/summary` endpoint that passes the deal's notes through the Claude API to produce a one-paragraph executive summary. Useful before a QBR or forecast call.

### Email / Slack notifications
A scheduled Python job that runs daily and sends a digest of deals closing within 7 days to Slack via webhook or email via `smtplib`. The `close_date` field is already structured for this.
