import Link from "next/link";
import type portfolio from "@/data/portfolio.json";
import { SpotlightCard } from "@/components/kiviui/spotlight-card";

type Project = (typeof portfolio.projects)[number];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type ProjectCardProps = { project: Project; featured?: boolean };

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const href = project.url || "/work/#archive-" + slugify(project.name);
  return (
    <SpotlightCard id={"archive-" + slugify(project.name)} className={"project-card" + (featured ? " project-card-featured" : "")}>
      <div className="eyebrow">{project.categories[0]} · {project.status}</div>
      <h3><Link href={href}>{project.name}</Link></h3>
      <p>{project.description}</p>
      {featured ? <div className="tags">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div> : null}
      {!featured ? <p className="scope">{project.scope}</p> : null}
      <Link className="project-link" href={href}>{project.url ? (project.url.includes("github.com") ? "View source" : "Explore project") : "Read project"} ↗</Link>
      {project.demoUrl ? <a className="text-link" href={project.demoUrl}>Live website ↗</a> : null}
    </SpotlightCard>
  );
}
