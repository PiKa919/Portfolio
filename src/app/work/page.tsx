import portfolio from "@/data/portfolio.json";
import { ForgeSightTerminal } from "@/components/portfolio/ForgeSightTerminal";
import { ProjectArchive } from "@/components/portfolio/ProjectArchive";
import { SiteFooter, SiteNav } from "@/components/portfolio/SiteNav";
import Link from "next/link";

export const metadata = { title: "Work", description: "Selected AI engineering systems, research prototypes, and project archive by Ankit Das." };

export default function WorkPage() {
  return <><SiteNav active="work"/><main className="page-shell detail-shell">
    <section className="page-intro section-pad"><p className="eyebrow">WORK / SELECTED SYSTEMS + ARCHIVE</p><h1>Useful systems.<br/><em>Honest evidence.</em></h1><p className="hero-copy">A few projects show how I approach engineering. The archive is here when you want to go deeper.</p></section>
    <section className="systems-section section-pad"><div className="section-heading"><p className="eyebrow">SYSTEM NOTES</p><h2>How the pieces fit.</h2></div>
      {portfolio.systems.map((system, index) => <article className="system-row" key={system.project}><div className="system-index">0{index + 1}</div><div><h3>{system.title}</h3><p>{system.description}</p><p className="system-flow">{system.flow}</p><Link className="text-link" href={system.link || `/work/#archive-${system.project.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>{system.project} details ↗</Link></div></article>)}
    </section>
    <section className="terminal-section section-pad"><div className="section-heading"><p className="eyebrow">ONE WORKFLOW, AT A GLANCE</p><h2>A release decision should be traceable.</h2><p>This is an illustrative sequence based on the ForgeSight design, not a captured terminal session.</p></div><ForgeSightTerminal/></section>
    <section className="archive-section section-pad" id="archive"><div className="section-heading"><p className="eyebrow">THE FULL INDEX</p><h2>Project archive</h2><p>Search by project, tool, or topic. Prototype and research scope is labeled on each entry.</p></div><ProjectArchive projects={portfolio.projects}/></section>
    <section className="archive-section section-pad"><div className="section-heading"><p className="eyebrow">EARLIER REPOSITORIES</p><h2>More experiments & contributions</h2></div><div className="repo-list">{portfolio.archives.map((item) => <a className="repo-item" key={item.name} href={item.url}><span>{item.name}</span><span>{item.description}</span><span>↗</span></a>)}</div></section>
  </main><SiteFooter/></>;
}
