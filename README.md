# Ankit Das portfolio

The GitHub Pages site serves the current portfolio from [`site/`](site/):

**https://pika919.github.io/Portfoio/**

The Pages workflow deploys that static directory when it changes on `master`. The older Next.js experiment remains in `src/`; GitHub Pages serves the static portfolio.

## Update the portfolio

Edit the project inventory in [`portfolio-source/projects.py`](portfolio-source/projects.py) and the page generator or visual template in `portfolio-source/`. Then run:

```sh
python3 portfolio-source/build.py
```

Review the generated page and commit the updated `site/`. A push to `master` deploys it. The site uses `/Portfoio/` as its base path, so keep the links in the HTML pointed there.

## Site contents

The page includes selected projects, professional experience, engineering walkthroughs, learning areas, and a searchable archive. Entries carry their evidence level and limits. The portfolio avoids private datasets, client records, credentials, and personal contact details.

The material in `src/` predates this static page. The page and its curated copy in `portfolio-source/` are the current portfolio. See [`portfolio-source/evidence.md`](portfolio-source/evidence.md) for the source boundaries and [`portfolio-source/design-notes.md`](portfolio-source/design-notes.md) for the design summary.

## Original Next.js project

The original Next.js source remains available for reference. GitHub Pages does not build or serve that project. Its original Vercel recommendation and resume assets describe the earlier experiment, not the Pages deployment.
