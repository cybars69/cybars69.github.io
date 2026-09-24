// Copies each skill repo's README verbatim into its project page, so the page is the skill's homepage.
//   npm run sync:skills
// Only the body of src/content/projects/<slug>.md is replaced; its front matter is kept.
// Relative links become GitHub URLs, and relative images are copied into public/images/skills/<slug>/.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skills = [
  { slug: 'aeo-skills', repo: 'cybars69/aeo-skills', dir: '../aeo-skills' },
  { slug: 'nonslop-sidebar', repo: 'cybars69/nonslop-sidebar', dir: '../nonslop-sidebar' },
];

const isExternal = (u) => /^(https?:|mailto:|tel:|#|\/\/|data:)/i.test(u);
const isImage = (u) => /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(u);

for (const { slug, repo, dir } of skills) {
  const srcDir = path.resolve(root, dir);
  let md = fs.readFileSync(path.join(srcDir, 'README.md'), 'utf8');

  const copied = new Set();
  const resolve = (url) => {
    if (isExternal(url) || url.startsWith('/')) return url;
    const clean = url.replace(/^\.\//, '');
    if (isImage(clean)) {
      const from = path.join(srcDir, clean);
      if (fs.existsSync(from)) {
        const name = path.basename(clean);
        const outDir = path.join(root, 'public/images/skills', slug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.copyFileSync(from, path.join(outDir, name));
        copied.add(name);
        return `/images/skills/${slug}/${name}`;
      }
    }
    const kind = clean.endsWith('/') || !path.extname(clean) ? 'tree' : 'blob';
    return `https://github.com/${repo}/${kind}/main/${clean.replace(/\/$/, '')}`;
  };

  // markdown links and images: ](url) or ](url "title")
  md = md.replace(/(\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g, (_, a, url, c) => `${a}${resolve(url)}${c}`);
  // raw HTML attributes
  md = md.replace(/\b(src|href)="([^"]+)"/g, (_, attr, url) => `${attr}="${resolve(url)}"`);

  const file = path.join(root, 'src/content/projects', `${slug}.md`);
  const existing = fs.readFileSync(file, 'utf8');
  const [, front] = existing.split(/^---\n/m);
  let fm = front.replace(/\n?$/, '\n');
  if (!/^readme:/m.test(fm)) fm += 'readme: true\n';
  const banner = `<!-- Synced verbatim from ${repo}/README.md by scripts/sync-skill-readmes.mjs. Edit the README, then run \`npm run sync:skills\`. -->\n\n`;
  fs.writeFileSync(file, `---\n${fm}---\n\n${banner}${md.trim()}\n`);
  console.log(`${slug}: ${md.split('\n').length} lines, images: ${[...copied].join(', ') || 'none'}`);
}
