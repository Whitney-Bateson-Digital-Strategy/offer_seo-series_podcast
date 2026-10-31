# Getting Found Online in the Age of AI — podcast series page

Astro build of the series landing page.

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the built site
```

## Where things live

- `src/data/series.ts` — **edit here**: Airtable form links, Zoom link, freebie URL, Acast episode IDs, show-notes links, the live audit replay (YouTube ID + sales page link), and all the cutoff/release times (UTC).
- `src/pages/index.astro` — the page, assembled from the section components in `src/components/`.
- `src/styles/global.css` — all styles.
- `src/lib/series.ts` — phase logic and episode-card rendering (used at build time and in the browser).
- `src/scripts/page.ts` — live updates in the browser: countdown, swapping copy at the audit cutoff / live / after phases.
- `public/` — images and the closer video. Drop `growth-show.jpg` in here to show the cover art above the episodes.

The episode list is rendered into the HTML at build time and refreshed in the browser, so the page stays correct between deploys.

`?preview=2026-10-28T15:00` (ET) shows the page as it will look at that time; `?placeholders=1` shows where each episode player will sit.
