"use client";

import { useMemo, useState } from "react";
import type portfolio from "@/data/portfolio.json";
import { ProjectCard } from "@/components/portfolio/ProjectCard";

type Project = (typeof portfolio.projects)[number];
const categories = ["All", "Vision", "Retrieval", "Systems", "Software", "Learning", "Contributions"] as const;
type Category = (typeof categories)[number];

type ProjectArchiveProps = { projects: Project[] };

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === "All" || project.category === category;
      const matchesQuery = !normalized || (project.name + " " + project.category + " " + project.status + " " + project.description + " " + project.stack.join(" ")).toLocaleLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, projects, query]);

  return (
    <>
      <div className="archive-tools">
        <label htmlFor="project-search">Search by name, tool, or topic</label>
        <input id="project-search" type="search" placeholder="Try OCR, Rust, voice, or evaluation" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="filters" role="group" aria-label="Project category">
          {categories.map((item) => <button key={item} className="filter" type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <p className="count" role="status" aria-live="polite">{filtered.length} of {projects.length} projects</p>
      </div>
      {filtered.length ? <div className="work-grid">{filtered.map((project) => <ProjectCard key={project.name} project={project} />)}</div> : <p className="empty">No matching projects. Try another topic or choose All.</p>}
    </>
  );
}
