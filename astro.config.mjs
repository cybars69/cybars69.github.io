import { defineConfig } from 'astro/config';

// GitHub Pages serves this repo's /docs folder, so the build lands there.
// Commit docs/ after every `npm run build`.
export default defineConfig({
  site: 'https://cybars69.github.io',
  outDir: './docs',
  build: { format: 'directory' },
});
