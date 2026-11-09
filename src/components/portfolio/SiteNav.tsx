import Link from "next/link";

type SiteNavProps = { active: "home" | "work" | "about" };

export function SiteNav({ active }: SiteNavProps) {
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link className="nav-mark" href="/" aria-label="Ankit Das, home">ankit das<span>.</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/" aria-current={active === "home" ? "page" : undefined}>home</Link>
          <Link href="/work/" aria-current={active === "work" ? "page" : undefined}>work</Link>
          <Link href="/about/" aria-current={active === "about" ? "page" : undefined}>about</Link>
          <a href="/Portfolio/Ankit_Das-Resume.pdf">resume</a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>© 2026 Ankit Das</span>
        <div><Link href="/work/">Work</Link><Link href="/about/">About</Link><a href="/Portfolio/Ankit_Das-Resume.pdf">Resume ↗</a><a href="https://www.linkedin.com/in/ankitdas919">LinkedIn ↗</a><a href="https://github.com/PiKa919/">GitHub ↗</a><a href="https://x.com/ankitdasdev">X ↗</a></div>
      </div>
    </footer>
  );
}
