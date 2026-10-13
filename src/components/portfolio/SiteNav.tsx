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
        <div><Link href="/work/">Work</Link><Link href="/about/">About</Link><a href="https://github.com/PiKa919/">GitHub ↗</a><a href="https://x.com/ankitdasamd">X ↗</a></div>
      </div>
    </footer>
  );
}
