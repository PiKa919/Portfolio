import Link from "next/link";
import portfolio from "@/data/portfolio.json";
import { AnimatedButton } from "@/components/kiviui/animated-button";
import { SpotlightCard } from "@/components/kiviui/spotlight-card";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SiteFooter, SiteNav } from "@/components/portfolio/SiteNav";

const featured = ["ForgeSight", "MP-KG-RAG", "Pratishtha / SAKECFEST"].map((name) => portfolio.projects.find((project) => project.name === name)!).filter(Boolean);

export default function Home() {
  return <><SiteNav active="home"/><main className="page-shell home-shell">
    <section className="hero section-pad">
      <p className="eyebrow">AI · COMPUTER VISION · SYSTEMS</p>
      <h1>I build AI systems<br/><em>you can inspect.</em></h1>
      <p className="hero-copy">I’m Ankit Das. I build applied AI and software systems, with experience in computer vision, document intelligence, retrieval, and full-stack development. I’m also studying the architectures behind the models.</p>
      <div className="hero-actions"><AnimatedButton text="Explore selected work" hoverText="See what I build ↗" href="/Portfolio/work/"/><Link className="text-link" href="/about/">A little about me ↓</Link></div>
      <div className="hero-meta"><span>Based in India</span><span>Freelancing with Kraxys Works</span><a href="mailto:ankitdas9810@gmail.com">ankitdas9810@gmail.com ↗</a></div>
    </section>
    <section className="capabilities section-pad" aria-labelledby="capabilities-title">
      <div className="section-heading"><p className="eyebrow">WHAT I BRING</p><h2 id="capabilities-title">From model behavior<br/>to dependable software.</h2></div>
      <div className="capability-grid">
        <SpotlightCard className="capability-card"><span className="number">01</span><h3>Computer vision & document AI</h3><p>OCR, layout understanding, detection, and evaluation for real-world inputs.</p></SpotlightCard>
        <SpotlightCard className="capability-card"><span className="number">02</span><h3>Applied AI systems</h3><p>Inference services, durable workflows, model comparison, and human review.</p></SpotlightCard>
        <SpotlightCard className="capability-card"><span className="number">03</span><h3>Efficient inference</h3><p>ONNX, native runtimes, device constraints, and measurements with stated limits.</p></SpotlightCard>
      </div>
    </section>
    <section className="selected section-pad" aria-labelledby="selected-title">
      <div className="section-heading row-heading"><div><p className="eyebrow">A FEW EXAMPLES</p><h2 id="selected-title">Selected work</h2></div><Link className="text-link" href="/work/">Browse all work ↗</Link></div>
      <div className="work-grid featured-grid">{featured.map((project) => <ProjectCard key={project.name} project={project} featured/>)}</div>
    </section>
    <section className="closing section-pad"><p className="eyebrow">THE SHORT VERSION</p><p className="closing-copy">My projects are a snapshot of what I build. My technical notes follow what I’m learning next.</p><Link className="text-link" href="/about/">Experience, research & ongoing study ↗</Link><a className="text-link closing-writing" href="https://x.com/ankitdasdev">Technical writing on X ↗</a></section>
  </main><SiteFooter/></>;
}
