---
title: "Rebuilt this site with Astro"
description: "Why the site moved from hand-written HTML to Astro, and how it deploys from a docs folder."
date: 2026-09-24
tags: [Astro, Meta]
---

This site used to be a pile of hand-written HTML files, one per page, each with its own copy of the same navbar. Changing a menu item meant editing six files.

It's now an [Astro](https://astro.build) project. The navbar lives in one component, the projects, tools and links are plain data files, and the pages are generated from those.

## How it ships

GitHub Pages can only serve the repo root or a `/docs` folder, so Astro is configured to build straight into `docs/`:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://cybars69.github.io',
  outDir: './docs',
});
```

The routine is `npm run build`, commit `docs/`, push. Pages serves whatever is in there.

## What didn't change

The look. Same fonts, same frosted cards, same Bootstrap 4 underneath. The point was to make the site easier to keep adding to, not to redesign it.
