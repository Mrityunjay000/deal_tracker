# Deal File Format

Each deal is a single `.md` file in the `deals/` directory. The filename becomes the deal's ID (e.g. `acme-corp.md` → `id: "acme-corp"`).

## Frontmatter Fields

All fields are optional except `stage`. The parser provides safe defaults for missing fields.

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | no | Full deal title. Defaults to the filename stem. |
| `company` | string | no | Company name. Used as the primary display label. |
| `contact` | string | no | Primary contact name. |
| `stage` | string | **yes** | Pipeline stage (see valid values below). |
| `value` | number | no | Deal value in USD. Defaults to 0. |
| `probability` | number | no | Win probability 0–100. Used for weighted forecast. |
| `close_date` | date | no | Expected close date (`YYYY-MM-DD`). Used in the Forecast chart. |
| `created` | date | no | Date the deal was created/opened. |
| `tags` | list | no | Free-form tags for filtering (e.g. `[enterprise, fintech]`). |

## Valid Stages

Stages represent the canonical deal pipeline. The UI renders them in this order:

```
discovery → qualification → demo → proposal → negotiation → closed-won
                                                           ↘ closed-lost
```

## Markdown Body

Everything after the `---` closing frontmatter delimiter is the deal's notes. Standard markdown is supported including:

- Headings (`## Notes`, `## Next Steps`)
- Bullet lists and nested lists
- Checkboxes (`- [ ] task` / `- [x] done`)
- Bold / italic (`**bold**`, `*italic*`)
- Inline code and code blocks

The body is rendered to HTML by the backend and displayed in the DealDetail drawer.

## Example

```markdown
---
title: Acme Corp - Enterprise Platform
company: Acme Corp
contact: Jane Smith
stage: proposal
value: 85000
probability: 65
close_date: 2026-08-15
created: 2026-04-01
tags: [enterprise, manufacturing]
---

## Notes

- **Apr 1:** Discovery call. Jane is VP of Operations.
- **May 14:** Full platform demo — strong positive reaction.

## Next Steps

- [ ] Follow up on proposal by June 20
- [x] Send case study
```

## Adding a New Field

1. Add the key to your `.md` frontmatter.
2. In `backend/parser.py`, read it with `meta.get("your_key", default)` and include it in the returned dict.
3. In `frontend/src/types/deal.ts`, add it to the `Deal` interface.
4. Display it wherever relevant (e.g. in `DealDetail.tsx`).
