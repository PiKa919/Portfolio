"""Export the curated portfolio ledger for the static Next.js build."""
import json
from pathlib import Path
from projects import ARCHIVES, LEARNING, PROJECTS, PROJECT_CATEGORIES, SYSTEMS

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "data" / "portfolio.json"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

projects = [
    {"name": name, "category": category, "categories": PROJECT_CATEGORIES[name], "status": status, "description": description, "stack": [part.strip() for part in stack.split("·")], "url": url, "scope": scope, "demoUrl": "https://pratishtha-web.vercel.app" if name == "Pratishtha / SAKECFEST" else ""}
    for name, category, status, description, stack, url, scope in PROJECTS
]
archives = [{"name": name, "description": description, "url": f"https://github.com/PiKa919/{name}"} for name, description in ARCHIVES]
learning = [{"title": title, "description": description, "proof": proof} for title, description, proof in LEARNING]
OUTPUT.write_text(json.dumps({"projects": projects, "archives": archives, "learning": learning, "systems": SYSTEMS, "projectCategories": ["Full-stack & web", "AI & agents", "CV & ML", "Geospatial", "Systems & inference", "Quantum computing", "Software", "Learning", "Contributions"]}, ensure_ascii=False, indent=2) + "\n")
print(f"Exported {len(projects)} projects, {len(archives)} earlier repositories, {len(learning)} learning areas, and {len(SYSTEMS)} system notes.")
