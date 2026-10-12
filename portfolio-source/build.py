"""Generate the static portfolio from curated public copy."""
from pathlib import Path
import re
from html import escape as e
from projects import PROJECTS, ARCHIVES, LEARNING, G, K

ROOT = Path(__file__).parent
OUT = ROOT.parent / 'site'
OUT.mkdir(exist_ok=True)
template = (ROOT / 'template.html').read_text()
css = re.search(r'<style>(.*?)</style>', template, re.S).group(1)
figures = re.search(r'(<div class="figures">.*?)(?=\n  <section id="fundamentals">)', template, re.S).group(1)
# The captured tail closes the original hero; retain only the figure column.
figures = figures.rsplit('    </div>', 1)[0].rstrip()
figures = figures.replace('fig. 1 —', 'fig. 1 ·').replace('fig. 2 —', 'fig. 2 ·').replace('fig. 3 —', 'fig. 3 ·')
figures = figures.replace('track</text>', 'verify</text>').replace('detect → NMS → track → deploy','detect → verify → deploy')

extra = '''
:root { --maxw: 1120px; --ink-faint: #a1a4b3; }
html {scroll-behavior:auto;scroll-padding-top:100px}summary {scroll-margin-top:100px}
body::before { pointer-events:none; }
.nav-inner {max-width:1120px; gap:20px}.nav-links {gap:18px;flex-wrap:wrap}
.hero {padding:88px 0 62px}.hero-grid {grid-template-columns:minmax(0,1fr) 235px;gap:65px}
.hero h1 {max-width:800px;font-size:clamp(42px,5.3vw,67px);line-height:1.1;letter-spacing:-.035em}
.kicker,.eyebrow {font:11px var(--mono);letter-spacing:.11em;text-transform:uppercase;color:var(--teal)}
.kicker {margin-bottom:25px}.lede {max-width:690px}.role {line-height:1.9}
.actions {display:flex;gap:13px;flex-wrap:wrap;margin-top:27px}.button {border:1px solid var(--rule);padding:10px 17px;border-radius:3px;text-decoration:none;font:12px var(--mono)}
.button.primary {background:var(--accent);color:var(--paper);border-color:var(--accent)}
.location {font:11px var(--mono);color:var(--ink-faint);margin-top:24px}
section {scroll-margin-top:100px;padding:52px 0}.head {align-items:baseline;gap:16px}.head h2 {font-size:34px;letter-spacing:-.025em}
.intro-copy {max-width:770px}.featured {display:grid;grid-template-columns:1fr 1fr;column-gap:40px}
.project {margin:0;padding:25px 0;border-top:1px solid var(--rule);border-bottom:0;min-width:0}
.project-top {align-items:baseline;gap:15px}.project-top h3 {font-size:21px;line-height:1.3}.project .kind {white-space:normal;overflow-wrap:anywhere;flex-shrink:0;text-align:right;max-width:140px}
.project p {font-size:14.5px}.project a {text-underline-offset:4px}.project .scope {font-size:12px;color:var(--ink-faint);margin-top:16px}
.project-link {display:inline-block;margin-top:12px}.tags {gap:6px}.tag {font-size:10px}
.work-row {display:grid;grid-template-columns:200px 1fr;gap:35px;padding:24px 0;border-top:1px solid var(--rule)}
.work-row h3 {margin:0;font-size:23px}.work-row p {margin:8px 0;color:var(--ink-soft);font-size:14.5px}
.work-date {font:11px var(--mono);color:var(--ink-faint);line-height:1.8}.work-title {color:var(--accent)}
.architecture-study {padding:24px;background:var(--paper-raised);border:1px solid var(--rule);border-radius:4px;margin-bottom:15px}
.architecture-study-top {flex-wrap:wrap;gap:12px}.architecture-study-top h3 {font-size:20px}.architecture-flow {flex-wrap:wrap}
.architecture-flow b {color:var(--ink-faint)}.architecture-flow span {white-space:normal}
.learning-grid {display:grid;grid-template-columns:1fr 1fr;gap:0 40px}.learning-item {border-top:1px solid var(--rule);padding:21px 0}.learning-item h3 {font-size:18px;font-weight:500;margin:0 0 8px}.learning-item p {font-size:14px;color:var(--ink-soft);margin:0}.learning-item small {display:block;color:var(--teal);font:10px/1.8 var(--mono);margin-top:10px}
.archive-tools {position:relative;padding:20px 0;border-top:1px solid var(--rule)}
label {display:block;font:11px var(--mono);margin-bottom:9px;color:var(--ink-soft)}input[type=search] {width:100%;font:15px var(--sans);background:var(--paper-raised);border:1px solid var(--rule);color:var(--ink);padding:14px;border-radius:3px}
.filters {display:flex;gap:7px;flex-wrap:wrap;margin:14px 0}.filter {font:11px var(--mono);background:transparent;color:var(--ink-soft);border:1px solid var(--rule);padding:9px 12px;cursor:pointer;border-radius:3px}.filter[aria-pressed=true] {color:var(--paper);background:var(--accent);border-color:var(--accent)}
.count {color:var(--ink-faint);font:11px var(--mono)}.archive-grid {display:grid;grid-template-columns:1fr 1fr;gap:0 40px}.archive-item[hidden] {display:none}
details .intro-copy {margin:18px 0 28px}details {border-top:1px solid var(--rule);padding:20px 0}summary {cursor:pointer;font:14px var(--mono)}.repo-list {display:grid;grid-template-columns:1fr 1fr;gap:12px 28px;padding:20px 0}.repo-list a {font-size:14px;overflow-wrap:anywhere}.repo-list small {display:block;color:var(--ink-faint);font-size:12px}
.evidence-grid {display:grid;grid-template-columns:1fr 1fr;gap:24px 40px}.evidence-grid article {border-top:1px solid var(--rule);padding-top:18px}.evidence-grid h3 {font-size:18px;margin:0}.evidence-grid p {font-size:14px;color:var(--ink-soft)}
.notice {border-left:2px solid var(--teal);padding:0 0 0 20px;margin:25px 0;color:var(--ink-soft);font-size:14px}
.contact-grid {grid-template-columns:repeat(3,1fr)}.skip {position:fixed;top:-100px;left:16px;background:var(--accent);color:var(--paper);padding:12px;z-index:100}.skip:focus {top:10px}
:focus-visible {outline:2px solid var(--teal);outline-offset:5px}a {overflow-wrap:anywhere}.reveal {opacity:1;transform:none}
footer {text-align:left;border-top:1px solid var(--rule);padding:25px 0 40px}footer .wrap {display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media(max-width:780px){header.nav {position:relative}.nav-inner {align-items:flex-start;flex-direction:column;gap:10px;padding:16px 0}.nav-links {gap:10px 16px;overflow:visible;font-size:10px}.hero {padding-top:44px}.hero-grid {grid-template-columns:1fr;gap:32px}.figures {order:0;flex-direction:row;gap:10px}.figure {max-width:31%;flex:1}.figure .cap {font-size:8px}.featured,.archive-grid,.learning-grid,.evidence-grid {grid-template-columns:1fr}.work-row {grid-template-columns:1fr;gap:7px}.head {align-items:flex-start;flex-direction:column;gap:5px}.head h2 {font-size:30px}.contact-grid {grid-template-columns:1fr}.repo-list {grid-template-columns:1fr}section {padding:36px 0}.architecture-study {padding:18px}.kind {font-size:9px;max-width:100px}.project-top h3 {font-size:20px}.wrap {width:calc(100% - 36px)}.nav-inner {width:calc(100% - 36px)}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after {animation:none!important;transition:none!important;stroke-dashoffset:0!important;opacity:1!important}}
'''
(OUT/'styles.css').write_text(css+'\n'+extra)

def card(p, i, archive=False):
    name,cat,status,desc,stack,url,scope=p
    slug = re.sub('[^a-z0-9]+','-',name.lower()).strip('-')
    title = f'<a href="{e(url)}">{e(name)}</a>' if url else e(name)
    return f'''<article class="project {'archive-item' if archive else ''}" id="{'archive-' if archive else ''}{slug}" data-category="{e(cat)}">
    <div class="eyebrow">{i:02d} / {e(cat)}</div>
    <div class="project-top"><h3>{title}</h3><span class="kind">{e(status)}</span></div>
    <p>{e(desc)}</p><div class="tags">{''.join('<span class="tag">'+e(s.strip())+'</span>' for s in stack.split('·'))}</div>
    <p class="scope">{e(scope)}</p>{f'<a class="project-link" href="{e(url)}">Explore source ↗</a>' if url else '<span class="count">Public summary · source not linked</span>'}</article>'''

def head(title,note=''):
    return f'<div class="head"><h2>{title}</h2><div class="note">{note}</div></div>'

featured = ''.join(card(PROJECTS[i],n+1) for n,i in enumerate([0,1,2,3,4,8]))
archive = ''.join(card(p,i+1,True) for i,p in enumerate(PROJECTS))
learning = ''.join(f'<article class="learning-item"><h3>{i+1:02d}. {e(t)}</h3><p>{e(d)}</p><small>{e(proof)}</small></article>' for i,(t,d,proof) in enumerate(LEARNING))
repos = ''.join(f'<div><a href="{G+e(n)}">{e(n)} ↗</a><small>{e(d)}</small></div>' for n,d in ARCHIVES)
systems = [
('Document inference with release gates','ForgeSight','page upload → durable ledger → isolated runtime → detections → frozen evaluation → release decision','Separate runtime processes keep memory measurements interpretable. Leases and fencing prevent an expired worker from writing stale results. The memory calibration rejected its own linear fit when measured RSS contradicted the assumption.','https://github.com/PiKa919/forgesight'),
('Evidence before generation','MP-KG-RAG','documents → source hashes → graph retrieval → frozen evidence → five perspectives → cited synthesis','All perspectives analyze the same evidence set. Schema repair, checkpoint identity, and per-row quarantine make failures inspectable. Evidence-ID membership is recorded separately from semantic support.',''),
('Explain a financial residual','Inventory-to-GL workbench','exports → health gates → normalized balances → evidenced bridges → residual review → evidence packet','Integer minor-unit money and immutable source versions support deterministic reconciliation. Reviewer decisions and audit events persist. The public demonstration uses synthetic data and keeps the ERP boundary read-only.','https://inventory-gl-demo.vercel.app/guide'),
('Native inference under a device budget','Q-Forge','model blocks → ONNX subgraphs → CPU / NNAPI → reusable buffers → timing and RSS','The Android experiment studies native orchestration and component behavior under memory and thermal constraints. Simulated attention limits what the benchmark can say about full-model generation.','https://github.com/PiKa919/Q-forge'),
]
system_html=''
for title,project,flow,desc,link in systems:
    parts=flow.split(' → ')
    system_html+=f'<article class="architecture-study"><div class="architecture-study-top"><h3>{e(title)}</h3><span>{e(project)}</span></div><div class="architecture-flow">'+ '<b aria-hidden="true">→</b>'.join('<span>'+e(x)+'</span>' for x in parts)+f'</div><p>{e(desc)}</p>'+(f'<a class="architecture-link" href="{e(link)}">Read the implementation ↗</a>' if link else '<a class="architecture-link" href="#archive-mp-kg-rag">Read the project summary ↓</a>')+'</article>'

html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ankit Das | AI systems, computer vision &amp; software</title>
<meta name="description" content="Ankit Das builds document AI, on-device inference, retrieval pipelines, and software systems. Explore projects, engineering decisions, and a learning archive.">
<meta name="theme-color" content="#0e0f14"><link rel="canonical" href="https://pika919.github.io/Portfoio/">
<meta property="og:title" content="Ankit Das | AI systems, vision &amp; software"><meta property="og:description" content="Document AI, resource-conscious inference, retrieval, and software systems. Selected work and a complete engineering archive."><meta property="og:type" content="website">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet"><link rel="stylesheet" href="/Portfoio/styles.css"><script src="/Portfoio/app.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header class="nav"><div class="nav-inner"><a class="nav-mark" href="#top">ankit das<span style="color:var(--teal)">.</span></a><nav class="nav-links" aria-label="Main navigation"><a href="#experience">experience</a><a href="#projects">selected work</a><a href="#systems">systems</a><a href="#learning">learning</a><a href="#archive">archive</a><a href="#contact">contact</a></nav></div></header>
<main id="main" class="wrap"><div id="top"></div>
<section class="hero" id="about" style="border-top:0"><div class="hero-grid"><div><p class="kicker">Ankit Das / engineering portfolio</p><h1>I build AI systems that can be <em>measured</em>, inspected, and used.</h1><p class="role">document AI · computer vision · inference · retrieval · software</p><p class="lede">I'm an AI systems and software engineer. My work spans document understanding, on-device inference, knowledge graphs, and the services and interfaces around them.</p><p class="lede">At IDVerse, I worked on document pipelines across 10+ document types. In my own work, I study what happens beyond the model: memory use, durable jobs, evaluation, failure recovery, and evidence a person can review.</p><div class="actions"><a class="button primary" href="#projects">Explore selected work ↓</a><a class="button" href="#archive">Browse the archive</a><a class="button" href="{G}">GitHub ↗</a></div><p class="location">Mumbai Metropolitan Region, India · Open to AI, vision, systems, and software roles</p></div>{figures}</div></section>
<section id="experience">{head('Experience','professional work')}<article class="work-row"><div class="work-date">FEB 2025 — AUG 2026<br>Remote</div><div><h3>IDVerse</h3><p class="work-title">Computer Vision Engineer</p><p>Document understanding across 10+ document types, combining OCR, layout and geometry signals, preprocessing, VLM/LLM inference, structured outputs, and field validation.</p><p>FastAPI and Docker services under memory constraints, CPU/GPU benchmarking, LoRA/QLoRA experiments, and browser/WASM OCR-KIE exploration.</p><p class="count">Later reclassified as Principal / Consulting Software Engineer. IDVerse was acquired by LexisNexis Risk Solutions / RELX.</p></div></article><article class="work-row"><div class="work-date">OCT 2023 — MAR 2024<br>Internship</div><div><h3>CybraneX</h3><p class="work-title">Quantum ML Intern</p><p>Explored quantum optimization in Julia, document extraction with TrOCR/Azure ML, and a Stripe/Django workflow. Contributed to a technical chapter described as forthcoming.</p></div></article></section>
<section id="projects">{head('Selected work','six ways I approach a system')}<p class="intro-copy">Projects across model serving, retrieval, mobile inference, and customer workflows. Each entry identifies its scope and evidence.</p><div class="featured">{featured}</div></section>
<section id="systems">{head('Inside the systems','decisions that shape the implementation')}<p class="intro-copy">The useful questions are often around the model. Who owns a job? Which version produced a result? What evidence supports a decision?</p>{system_html}</section>
<section id="learning">{head('What I have learned','practice, connected to projects')}<p class="intro-copy">A map of the areas I have worked through. Depth varies by project; the references show where I applied each area.</p><div class="learning-grid">{learning}</div></section>
<section id="evidence">{head('Research &amp; evidence','what a result can tell us')}<div class="evidence-grid"><article><h3>A completed research archive</h3><p>MP-KG-RAG includes four variants with 1,550 final rows each and 7,750 perspective records. The archive supports reproducibility and failure analysis. It does not establish uniformly better semantic answer quality.</p></article><article><h3>A fixed evaluation set</h3><p>TerraServe's archived MobileNetV3-Small predictions contain 202 correct classifications out of 210 supplied evaluation tiles. That is a fixed-set result. Geographic independence and generalization remain unestablished.</p></article><article><h3>A memory model that failed</h3><p>ForgeSight's assumed linear peak-RSS fit produced an invalid negative intercept. Calibration now reports the fit as invalid and falls back to the largest measured peak, with the finding recorded in an architecture decision.</p></article><article><h3>Competition and notebook practice</h3><p>The October 4 Kaggle audit recorded eight completed competitions and public experiments across OCR, speech, CryoET, RNA, remote sensing, and applied prediction. Private drafts and linked work are not counted as independently authored publications.</p><a class="project-link" href="{K}">Explore Kaggle ↗</a></article></div><p class="notice">I keep the input, model, dataset split, metric definition, and execution status attached to a result. A local test, an archived run, a hosted demo, and customer production each provide different evidence.</p></section>
<section id="archive">{head('The project &amp; learning archive',str(len(PROJECTS))+' curated entries + repository archive')}<p class="intro-copy">Explore the broader record: implemented tools, research, prototypes, competition experiments, contributions, and early practice.</p><div class="archive-tools"><label for="search">Search projects, tools, or topics</label><input type="search" id="search" placeholder="Try OCR, Rust, voice, or evaluation"><div class="filters" role="group" aria-label="Project category">{''.join(f'<button class="filter" type="button" data-filter="{c}" aria-pressed="{str(c=="All").lower()}">{c}</button>' for c in ['All','Vision','Retrieval','Systems','Software','Learning','Contributions'])}</div><p id="result-count" class="count" role="status" aria-live="polite">{len(PROJECTS)} projects</p></div><div class="archive-grid">{archive}</div><p id="empty" hidden>No matching projects. Try another topic or choose All.</p><details><summary>Earlier repositories &amp; learning archives · {len(ARCHIVES)} entries</summary><p class="intro-copy">Historical repositories from the October 4 inventory. These are separate from the selected work above; current execution and service availability are not asserted.</p><div class="repo-list">{repos}</div></details><details><summary>Contributions, attribution &amp; scope</summary><p class="intro-copy">openGym setup work and ai-job-search customization are contributions to existing projects. Forks of OpenCode, llama.cpp, MindsDB, awesome-copilot, Philophysics-web, Deployment.inc hiring problems, and javascript-basic-projects are not original projects. Upstream ROCm and Paddle checkouts are not claimed as authored work.</p><p class="intro-copy">Unbuilt concepts, empty or insufficiently documented workspaces, private evaluation datasets, customer materials, and personal financial artifacts are excluded. Local-only projects have a public summary rather than a source link.</p></details></section>
<section id="contact">{head('Let\'s build something useful.','AI · vision · systems · software')}<p class="intro-copy">I am interested in roles where models meet real software constraints, and where implementation, evaluation, and delivery belong together.</p><div class="contact-grid"><div class="contact-row"><span class="k">Get in touch</span><span class="v"><a href="https://www.linkedin.com/in/ankitdas919/">LinkedIn ↗</a></span></div><div class="contact-row"><span class="k">Source &amp; experiments</span><span class="v"><a href="{G}">GitHub / PiKa919 ↗</a></span></div><div class="contact-row"><span class="k">ML notebooks</span><span class="v"><a href="{K}">Kaggle / pikaaa ↗</a></span></div></div></section></main>
<footer><div class="wrap"><span>© 2026 Ankit Das · Built with evidence.</span><span>Updated 13 October 2026 · <a href="#top">Back to top ↑</a></span></div></footer></body></html>'''
(OUT/'index.html').write_text(html)
(OUT/'favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0e0f14"/><text x="10" y="45" fill="#b7a6ff" font-family="Georgia" font-size="38">ad</text></svg>')
(OUT/'app.js').write_text('''
const search = document.querySelector('#search');
const buttons = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.archive-item')];
let category = 'All';
function update() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const project of projects) {
    const show = (category === 'All' || project.dataset.category === category) && project.textContent.toLocaleLowerCase().includes(query);
    project.hidden = !show;
    if (show) count++;
  }
  document.querySelector('#result-count').textContent = `${count} of ${projects.length} projects`;
  document.querySelector('#empty').hidden = count !== 0;
}
search.addEventListener('input', update);
for (const button of buttons) button.addEventListener('click', () => {
  category = button.dataset.filter;
  for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
  update();
});
''')
print(f'Built {len(PROJECTS)} curated projects, {len(ARCHIVES)} archived repositories, {len(LEARNING)} learning areas.')
