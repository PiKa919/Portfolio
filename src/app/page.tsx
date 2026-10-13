import Link from "next/link";
import portfolio from "@/data/portfolio.json";
import { AnimatedButton } from "@/components/kiviui/animated-button";
import { SpotlightCard } from "@/components/kiviui/spotlight-card";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SiteFooter, SiteNav } from "@/components/portfolio/SiteNav";

const featured = ["ForgeSight", "MP-KG-RAG", "Q-Forge"].map((name) => portfolio.projects.find((project) => project.name === name)!).filter(Boolean);

export default function Home() {
  return <><SiteNav active="home"/><main className="page-shell home-shell">
    <section className="hero section-pad">
      <p className="eyebrow">AI · COMPUTER VISION · SYSTEMS</p>
      <h1>I build AI systems<br/><em>you can inspect.</em></h1>
      <p className="hero-copy">I’m Ankit Das, an engineer working across computer vision, document AI, retrieval, and efficient inference. I turn model ideas into testable software with clear evidence and limits.</p>
      <div className="hero-actions"><AnimatedButton text="Explore selected work" hoverText="See what I build ↗" href="/Portfolio/work/"/><Link className="text-link" href="/about/">A little about me ↓</Link></div>
      <div className="hero-meta"><span>Based in India</span><span>Open to AI engineering & applied systems roles</span><a href="mailto:ankitdas9810@gmail.com">ankitdas9810@gmail.com ↗</a></div>
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
    <section className="closing section-pad"><p className="eyebrow">THE SHORT VERSION</p><p className="closing-copy">I like hard engineering problems, honest evaluation, and building the glue that makes AI useful.</p><Link className="text-link" href="/about/">Read about my experience and approach ↗</Link></section>
  </main><SiteFooter/></>;
}
