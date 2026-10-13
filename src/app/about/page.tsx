import portfolio from "@/data/portfolio.json";
import { SiteFooter, SiteNav } from "@/components/portfolio/SiteNav";

export const metadata = { title: "About", description: "Experience, focus areas, and engineering approach of Ankit Das." };

export default function AboutPage() {
  return <><SiteNav active="about"/><main className="page-shell detail-shell">
    <section className="page-intro section-pad"><p className="eyebrow">ABOUT / ANKIT DAS</p><h1>Curious about models.<br/><em>Serious about systems.</em></h1><p className="hero-copy">I’m an AI and computer-vision engineer who enjoys making model behavior measurable, useful, and easier to trust.</p></section>
    <section className="about-block section-pad"><div className="section-heading"><p className="eyebrow">EXPERIENCE</p><h2>Work grounded in practice.</h2></div><div className="experience-list"><article><p className="eyebrow">FEB 2025 — AUG 2026</p><h3>AI Engineer · IDVerse</h3><p>Worked on document intelligence and computer-vision systems, including OCR, layout understanding, structured extraction, and evaluation workflows.</p></article><article><p className="eyebrow">OCT 2023 — MAR 2024</p><h3>Engineering Intern · CybraneX</h3><p>Built and explored software in a cybersecurity setting, strengthening my foundations in practical engineering and problem solving.</p></article></div></section>
    <section className="about-block section-pad"><div className="section-heading"><p className="eyebrow">CURRENT TOOLKIT</p><h2>Areas I’ve worked to understand.</h2></div><div className="learning-grid">{portfolio.learning.map((item) => <article className="learning-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p><p className="scope">Evidence: {item.proof}</p></article>)}</div></section>
    <section className="closing section-pad"><p className="eyebrow">HOW I WORK</p><p className="closing-copy">I prefer small, inspectable systems, explicit assumptions, and evaluation that can say “not ready” when the evidence is weak.</p><a className="text-link" href="mailto:ankitdas9810@gmail.com">Get in touch ↗</a></section>
  </main><SiteFooter/></>;
}
