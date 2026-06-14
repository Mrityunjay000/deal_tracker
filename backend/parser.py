import frontmatter
import markdown as md
from pathlib import Path


def parse_deal_file(path: Path) -> dict:
    post = frontmatter.load(str(path))
    meta = post.metadata
    body_html = md.markdown(post.content, extensions=["extra", "nl2br"])

    return {
        "id": path.stem,
        "title": meta.get("title", path.stem),
        "company": meta.get("company", ""),
        "contact": meta.get("contact", ""),
        "stage": meta.get("stage", "discovery"),
        "value": float(meta.get("value", 0)),
        "probability": int(meta.get("probability", 0)),
        "closeDate": str(meta.get("close_date", "")),
        "created": str(meta.get("created", "")),
        "tags": meta.get("tags", []),
        "notes": body_html,
    }


def parse_all_deals(deals_dir: Path) -> list[dict]:
    deals = []
    for path in sorted(deals_dir.glob("*.md")):
        try:
            deals.append(parse_deal_file(path))
        except Exception as e:
            print(f"[parser] Skipping {path.name}: {e}")
    return deals
