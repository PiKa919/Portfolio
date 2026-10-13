# Ankit Das portfolio

The GitHub Pages site serves the current portfolio from [`out/`](out/):

**https://pika919.github.io/Portfolio/**

The Pages workflow builds a static Next.js export from `src/` and deploys it on pushes to `master`.

## Update the portfolio

Edit the project inventory in [`portfolio-source/projects.py`](portfolio-source/projects.py) and update the Next.js pages/components in `src/`. Then run:

```sh
bun run build
```

The build exports static files to `out/` using `/Portfolio/` as the GitHub Pages base path. A push to `master` builds and deploys them.

## Site contents

The page includes selected projects, professional experience, engineering walkthroughs, learning areas, and a searchable archive. Entries carry their evidence level and limits. No private datasets, client records, credentials, or personal financial data are published.

See [`portfolio-source/evidence.md`](portfolio-source/evidence.md) for source boundaries and [`portfolio-source/design-notes.md`](portfolio-source/design-notes.md) for the design summary. `bun run build` refreshes `src/data/portfolio.json` from the curated ledger.

## Original Next.js project

The portfolio is now served from GitHub Pages at `https://pika919.github.io/Portfolio/`.
