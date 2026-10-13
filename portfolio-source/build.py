"""Generate the static portfolio from curated public copy."""
from pathlib import Path
import re
from html import escape as e
from projects import PROJECTS, ARCHIVES, LEARNING, SYSTEMS, G, K

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
systems = [(item['title'], item['project'], item['flow'], item['description'], item['link']) for item in SYSTEMS]
system_html=''
for title,project,flow,desc,link in systems:
    parts=flow.split(' → ')
    system_html+=f'<article class="architecture-study"><div class="architecture-study-top"><h3>{e(title)}</h3><span>{e(project)}</span></div><div class="architecture-flow">'+ '<b aria-hidden="true">→</b>'.join('<span>'+e(x)+'</span>' for x in parts)+f'</div><p>{e(desc)}</p>'+(f'<a class="architecture-link" href="{e(link)}">Read the implementation ↗</a>' if link else '<a class="architecture-link" href="#archive-mp-kg-rag">Read the project summary ↓</a>')+'</article>'

BASE = "/Portfolio"
FONT_LINK = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">'
PAGE_CSS = '''
.page-hero {padding:68px 0 42px;border-top:0}.page-hero h1 {font-size:clamp(40px,6vw,66px);line-height:1.08;max-width:850px;letter-spacing:-.03em}.page-hero p {max-width:660px;color:var(--ink-soft);font-size:17px;margin:18px 0 0}
.home-proof {display:grid;grid-template-columns:repeat(3,1fr);gap:18px;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:20px 0;margin:28px 0}.home-proof strong {display:block;font:12px var(--mono);color:var(--teal);margin-bottom:5px}.home-proof span {font-size:13px;color:var(--ink-soft)}
.home-experience {display:grid;grid-template-columns:1fr 1fr;gap:0 36px}.home-role {border-top:1px solid var(--rule);padding:14px 0}.home-role h3 {font-size:18px}.home-role p {margin:4px 0;color:var(--ink-soft);font-size:13px}.home-role small {color:var(--ink-faint);font:10px var(--mono)}
.home-projects {display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.home-project {border:1px solid var(--rule);background:var(--paper-raised);padding:18px;display:flex;flex-direction:column;min-height:215px}.home-project .eyebrow {margin-bottom:9px}.home-project h3 {font-size:20px}.home-project p {font-size:13px;color:var(--ink-soft);line-height:1.55;margin:9px 0 14px}.home-project .project-link {margin-top:auto;align-self:flex-start}
.page-links {display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.page-links a {font:11px var(--mono);padding:9px 12px;border:1px solid var(--rule);text-decoration:none;color:var(--ink-soft)}.page-links a:hover {border-color:var(--accent);color:var(--ink)}
.page-section {padding:32px 0}.page-section .head {margin-bottom:16px}.page-section .head h2 {font-size:28px}.work-grid {display:grid;grid-template-columns:1fr 1fr;gap:0 36px}.work-grid .project {padding:20px 0}.work-intro {max-width:700px;color:var(--ink-soft);font-size:14px;margin:0 0 20px}.about-columns {display:grid;grid-template-columns:1fr 1fr;gap:32px}.about-columns h3 {font-size:20px;margin-bottom:10px}.about-columns p {font-size:14px;color:var(--ink-soft)}
@media(max-width:780px){.page-hero{padding:42px 0 24px}.home-proof{grid-template-columns:1fr;gap:13px;margin:20px 0}.home-experience,.home-projects,.work-grid,.about-columns{grid-template-columns:1fr}.home-project{min-height:unset}.page-section{padding:25px 0}.nav-links{gap:10px 16px}}
'''
(OUT/'styles.css').write_text(css+'\\n'+extra+'\\n'+PAGE_CSS)

def site_nav(active):
    links = [('Home','/'),('Work','/work/'),('About','/about/')]
    items=''.join(f'<a href="{BASE+path}"'+(' aria-current="page"' if name==active else '')+f'>{name.lower()}</a>' for name,path in links)
    return f'<header class="nav"><div class="nav-inner"><a class="nav-mark" href="{BASE}/">ankit das<span style="color:var(--teal)">.</span></a><nav class="nav-links" aria-label="Main navigation">{items}</nav></div></header>'

def document(title, description, active, body, script=''):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title><meta name="description" content="{description}"><meta name="theme-color" content="#0e0f14"><link rel="canonical" href="https://pika919.github.io{BASE}{'/' if active=='Home' else '/' + active.lower() + '/'}"><link rel="icon" href="{BASE}/favicon.svg" type="image/svg+xml">{FONT_LINK}<link rel="stylesheet" href="{BASE}/styles.css">{script}</head><body><div id="top"></div><a class="skip" href="#main">Skip to content</a>{site_nav(active)}<main id="main" class="wrap">{body}</main><footer><div class="wrap"><span>© 2026 Ankit Das</span><span><a href="{BASE}/">Home</a> · <a href="{BASE}/work/">Selected work &amp; archive</a> · <a href="{BASE}/about/">Background</a> · <a href="#top">Back to top ↑</a></span></div></footer></body></html>'''

# The homepage is a one-minute introduction: positioning, strongest proof, three projects, and next steps.
main_projects = [(PROJECTS[i], summary) for i, summary in zip([0, 1, 2], [
    'Inspectable document-layout inference with isolated workers and a durable reviewable job ledger.',
    'Knowledge-graph retrieval that freezes evidence before synthesis and tracks failures per row.',
    'An Android benchmark for ONNX subgraphs, CPU/NNAPI routing, reusable buffers, and device telemetry.',
])]
project_cards = ''.join(f'''<article class="home-project"><div class="eyebrow">{e(p[2])}</div><h3>{e(p[0])}</h3><p>{e(summary)}</p><a class="project-link" href="{e(p[5]) if p[5] else BASE+'/work/#archive-'+re.sub('[^a-z0-9]+','-',p[0].lower()).strip('-')}">{('View source' if p[5] else 'Read project')} ↗</a></article>''' for p, summary in main_projects)
body_home=f'''<section class="page-hero"><p class="kicker">Ankit Das / AI &amp; software engineer</p><h1>I build AI systems people can <em>inspect</em> and trust.</h1><p>Computer vision, document AI, retrieval, and resource-aware inference—built with the services, evaluation, and review tools around the model.</p><div class="home-proof"><div><strong>DOCUMENT AI</strong><span>Production document pipelines across 10+ document types at IDVerse.</span></div><div><strong>END-TO-END SYSTEMS</strong><span>APIs, durable jobs, runtime isolation, and reviewer-facing tools.</span></div><div><strong>MEASURED ENGINEERING</strong><span>Evaluation that records scope, limits, and what a result can support.</span></div></div><div class="page-links"><a href="{BASE}/work/">See selected work →</a><a href="{BASE}/about/">Experience &amp; skills →</a><a href="https://github.com/PiKa919/">GitHub ↗</a><a href="https://www.linkedin.com/in/ankitdas919/">LinkedIn ↗</a></div></section>
<section class="page-section"><div class="head"><h2>Experience</h2><div class="note">two roles, at a glance</div></div><div class="home-experience"><article class="home-role"><small>FEB 2025 — AUG 2026</small><h3>IDVerse</h3><p>Computer Vision Engineer · document pipelines, OCR/KIE, model inference, FastAPI services, and CPU/GPU evaluation.</p></article><article class="home-role"><small>OCT 2023 — MAR 2024</small><h3>CybraneX</h3><p>Quantum ML Intern · optimization experiments, document extraction, and a Django/Stripe workflow.</p></article></div></section>
<section class="page-section"><div class="head"><h2>Selected work</h2><div class="note">three examples</div></div><div class="home-projects">{project_cards}</div><div class="page-links"><a href="{BASE}/work/">More projects, system notes &amp; evidence →</a></div></section>
<section class="page-section"><div class="head"><h2>Good work starts with a real problem.</h2><div class="note">AI · vision · systems</div></div><p class="work-intro">I’m interested in AI engineering roles where models meet real product and infrastructure constraints.</p><div class="page-links"><a href="https://www.linkedin.com/in/ankitdas919/">Contact on LinkedIn ↗</a><a href="{BASE}/about/">Read my background →</a></div></section>'''
(OUT/'index.html').write_text(document('Ankit Das | AI & software engineer','Ankit Das builds inspectable AI systems across computer vision, document AI, retrieval, and resource-aware inference.','Home',body_home))

work_script=f'<script src="{BASE}/app.js" defer></script>'
body_work=f'''<section class="page-hero"><p class="kicker">Selected work / project archive</p><h1>Systems, prototypes, and experiments.</h1><p>A browsable record of what I have built and studied. Each entry labels its status, scope, and evidence.</p></section>
<section class="page-section"><div class="head"><h2>Flagship systems</h2><div class="note">design decisions in context</div></div><p class="work-intro">These notes explain the engineering choices behind four projects.</p>{system_html}</section>
<section class="page-section" id="archive"><div class="head"><h2>Project archive</h2><div class="note">{len(PROJECTS)} curated entries</div></div><p class="work-intro">Implemented software, research, prototypes, competition work, contributions, and learning projects.</p><div class="archive-tools"><label for="search">Search by name, tool, or topic</label><input type="search" id="search" placeholder="Try OCR, Rust, voice, evaluation"><div class="filters" role="group" aria-label="Project category">{''.join(f'<button class="filter" type="button" data-filter="{c}" aria-pressed="{str(c=="All").lower()}">{c}</button>' for c in ['All','Vision','Retrieval','Systems','Software','Learning','Contributions'])}</div><p id="result-count" class="count" role="status" aria-live="polite">{len(PROJECTS)} projects</p></div><div class="work-grid">{archive}</div><p id="empty" hidden>No matching projects. Try another topic or choose All.</p></section>
<section class="page-section"><div class="head"><h2>Earlier repositories</h2><div class="note">{len(ARCHIVES)} historical entries</div></div><p class="work-intro">Older repositories from the October 4 inventory. These links are archive references; current execution or service availability is not implied.</p><div class="repo-list">{repos}</div><details><summary>Attribution &amp; exclusions</summary><p class="intro-copy">openGym setup work and ai-job-search customization are contributions to existing projects. Forks of OpenCode, llama.cpp, MindsDB, awesome-copilot, Philophysics-web, Deployment.inc hiring problems, and javascript-basic-projects are not original projects. Upstream ROCm and Paddle checkouts are not claimed as authored work.</p><p class="intro-copy">Unbuilt concepts, empty or insufficiently documented workspaces, private evaluation datasets, customer materials, and personal financial artifacts are excluded. Local-only projects have a public summary rather than a source link.</p></details></section>'''
(OUT/'work/index.html').parent.mkdir(parents=True,exist_ok=True)
(OUT/'work/index.html').write_text(document('Selected work & project archive | Ankit Das','Selected engineering systems, prototypes, research, and learning projects by Ankit Das.','Work',body_work,work_script))

body_about=f'''<section class="page-hero"><p class="kicker">Background / skills / evidence</p><h1>What I’ve worked on—and what the evidence says.</h1><p>My experience crosses computer vision, document understanding, quantum ML, retrieval, and software systems. Depth varies by project, so I link each area to its proof.</p></section>
<section class="page-section"><div class="head"><h2>Experience</h2><div class="note">professional history</div></div><article class="work-row"><div class="work-date">FEB 2025 — AUG 2026<br>Remote</div><div><h3>IDVerse</h3><p class="work-title">Computer Vision Engineer</p><p>Document understanding across 10+ document types, combining OCR, layout and geometry signals, preprocessing, VLM/LLM inference, structured outputs, and field validation.</p><p>FastAPI and Docker services under memory constraints, CPU/GPU benchmarking, LoRA/QLoRA experiments, and browser/WASM OCR-KIE exploration.</p><p class="count">Later reclassified as Principal / Consulting Software Engineer. IDVerse was acquired by LexisNexis Risk Solutions / RELX.</p></div></article><article class="work-row"><div class="work-date">OCT 2023 — MAR 2024<br>Internship</div><div><h3>CybraneX</h3><p class="work-title">Quantum ML Intern</p><p>Explored quantum optimization in Julia, document extraction with TrOCR/Azure ML, and a Stripe/Django workflow. Contributed to a technical chapter described as forthcoming.</p></div></article></section>
<section class="page-section"><div class="head"><h2>Areas I’ve learned through practice</h2><div class="note">connected to projects</div></div><p class="work-intro">A map of the areas I have worked through. This is not a claim of equal depth across every tool.</p><div class="learning-grid">{learning}</div></section>
<section class="page-section"><div class="head"><h2>Research &amp; evidence</h2><div class="note">results with limits</div></div><div class="evidence-grid"><article><h3>MP-KG-RAG research archive</h3><p>Four variants with 1,550 final rows each and 7,750 perspective records. The archive supports reproducibility and failure analysis; it does not establish uniformly better semantic answer quality.</p></article><article><h3>TerraServe fixed-set evaluation</h3><p>Archived MobileNetV3-Small predictions contain 202 correct classifications out of 210 supplied evaluation tiles. Geographic independence and generalization remain unestablished.</p></article><article><h3>ForgeSight calibration failure</h3><p>An assumed linear peak-RSS fit produced an invalid negative intercept. Calibration reports the fit as invalid and falls back to the largest measured peak.</p></article><article><h3>Competition and notebook practice</h3><p>The October 4 Kaggle audit recorded eight completed competitions and public experiments across OCR, speech, CryoET, RNA, remote sensing, and applied prediction.</p><a class="project-link" href="{K}">Explore Kaggle ↗</a></article></div><p class="notice">A local test, archived run, hosted demo, and customer production each support different claims. I keep those boundaries visible.</p></section>
<section class="page-section"><div class="head"><h2>Explore</h2><div class="note">more context</div></div><div class="page-links"><a href="{BASE}/work/">Project archive →</a><a href="{G}">GitHub ↗</a><a href="{K}">Kaggle ↗</a><a href="https://www.linkedin.com/in/ankitdas919/">LinkedIn ↗</a></div></section>'''
(OUT/'about/index.html').parent.mkdir(parents=True,exist_ok=True)
(OUT/'about/index.html').write_text(document('Background & skills | Ankit Das','Professional experience, technical areas, and evidence notes for Ankit Das.','About',body_about))
(OUT/'favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0e0f14"/><text x="10" y="45" fill="#b7a6ff" font-family="Georgia" font-size="38">ad</text></svg>')
(OUT/'app.js').write_text('''const search = document.querySelector('#search');
if (search) {
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
}
''')
print(f'Built concise homepage, work and about pages; {len(PROJECTS)} curated projects, {len(ARCHIVES)} archived repositories, {len(LEARNING)} learning areas.')
