// Markdown twins of every page, generated at build time for agents and llms.txt.
// The site is static-only: every route exists as the plain URL and as the same URL plus ".md"
//   /blog/x/  <->  /blog/x.md        /tools/  <->  /tools.md        /  <->  /index.md
// Each page advertises its twin with <link rel="alternate" type="text/markdown">.
import { getCollection, type CollectionEntry } from 'astro:content';
import { site, about, experience, education, skills, linkGroups } from '../data/site';
import { toolGroups } from '../data/tools';

export const abs = (p: string) => new URL(p, site.url).href;

/** /blog/x/ -> /blog/x.md ; /tools/ -> /tools.md ; / -> /index.md ; the 404 page has no twin. */
export function twinPath(pathname: string): string | null {
  if (pathname.endsWith('.html')) return null;
  const bare = pathname.replace(/\/+$/, '');
  return bare === '' ? '/index.md' : `${bare}.md`;
}

export const markdownResponse = (body: string) =>
  new Response(body.trim() + '\n', { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

/** Bodies use site-relative links; agents need absolute ones. Sync banners are dropped. */
function clean(body: string): string {
  return body
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/\]\(\/(?!\/)/g, `](${site.url}/`)
    .replace(/\b(src|href)="\/(?!\/)/g, `$1="${site.url}/`)
    .trim();
}

const header = (title: string, path: string, blurb?: string) =>
  `# ${title}\n\n${blurb ? `${blurb}\n\n` : ''}Source: ${abs(path)}\n`;

const sorted = async () => ({
  posts: (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  ),
  projects: (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order),
});

export async function homeMd() {
  const { posts, projects } = await sorted();
  const featured = projects.filter((p) => p.data.featured);
  return [
    header(`${site.name} (${site.handle})`, '/', site.description),
    `## About\n\nLocation: ${site.location}\n\n${about.join('\n\n')}\n\nRésumé: ${abs(site.resume)}`,
    `## Experience\n\n${experience
      .map((e) => `### ${e.org}, ${e.role} (${e.when})\n\n${e.points.map((p) => `- ${p}`).join('\n')}`)
      .join('\n\n')}\n\n### ${education.school} (${education.when})\n\n${education.degree}`,
    `## Skills\n\n${skills.map((g) => `- **${g.title}:** ${g.items.join(', ')}`).join('\n')}`,
    `## Selected work\n\n${featured.map((p) => `- [${p.data.title}](${abs(`/projects/${p.id}/`)}): ${p.data.blurb}`).join('\n')}`,
    `## Latest posts\n\n${posts.slice(0, 5).map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.description}`).join('\n')}`,
    `## Elsewhere\n\n${linkGroups[0].items.map((l) => `- [${l.label}](${l.href.startsWith('http') || l.href.startsWith('mailto') ? l.href : abs(l.href)})`).join('\n')}`,
  ].join('\n\n');
}

export function toolsMd() {
  return [
    header('Tools', '/tools/', 'The languages, frameworks, platforms and practices I work with, and what each was used for.'),
    ...toolGroups.map(
      (g) =>
        `## ${g.title}\n\n${g.intro}\n\n${g.items.map((t) => `- **${t.name}**: ${t.use} (${t.where.join(', ')})`).join('\n')}`,
    ),
  ].join('\n\n');
}

export function linksMd() {
  return [
    header('Links', '/links/', 'Where to find me online.'),
    ...linkGroups.map(
      (g) =>
        `## ${g.title}\n\n${g.items
          .map((l) => `- [${l.label}](${l.href.startsWith('http') || l.href.startsWith('mailto') ? l.href : abs(l.href)})`)
          .join('\n')}`,
    ),
  ].join('\n\n');
}

export function contactMd() {
  return [
    header('Contact', '/contact/', 'How to get in touch.'),
    `Email: [${site.email}](mailto:${site.email})\n\nThe page also has a contact form. If it fails, email is the reliable route.`,
  ].join('\n\n');
}

export async function projectsIndexMd() {
  const { projects } = await sorted();
  const section = (title: string, era: string) =>
    `## ${title}\n\n${projects
      .filter((p) => p.data.era === era)
      .map((p) => `- [${p.data.title}](${abs(`/projects/${p.id}.md`)}): ${p.data.blurb}${p.data.status === 'killed' ? ' (killed)' : ''}`)
      .join('\n')}`;
  return [
    header('Projects', '/projects/', 'Client and studio projects are anonymized.'),
    section('Recent work', 'recent'),
    section('Side projects', 'side'),
    section('Pre-AI-slop', 'pre-ai'),
  ].join('\n\n');
}

export async function blogIndexMd() {
  const { posts } = await sorted();
  return [
    header('Blog', '/blog/', 'Technical write-ups.'),
    posts
      .map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}.md`)}) (${p.data.date.toISOString().slice(0, 10)}): ${p.data.description}`)
      .join('\n'),
  ].join('\n\n');
}

export function projectMd(entry: CollectionEntry<'projects'>) {
  const p = entry.data;
  const meta = [p.kind && `Kind: ${p.kind}`, p.tags.length && `Tags: ${p.tags.join(', ')}`, p.status === 'killed' && 'Status: killed', p.github && `Source: ${p.github}`, p.live && p.status !== 'killed' && `Live: ${p.live}`]
    .filter(Boolean)
    .join('\n');
  // README-backed pages already open with their own title
  const body = clean(entry.body ?? '');
  return p.readme ? `${body}\n\nPage: ${abs(`/projects/${entry.id}/`)}` : [header(p.title, `/projects/${entry.id}/`, p.blurb), meta, body].filter(Boolean).join('\n\n');
}

export function postMd(entry: CollectionEntry<'blog'>) {
  const d = entry.data;
  return [header(d.title, `/blog/${entry.id}/`, d.description), `Published: ${d.date.toISOString().slice(0, 10)}\nTags: ${d.tags.join(', ')}`, clean(entry.body ?? '')].join('\n\n');
}

export async function llmsTxt() {
  const { posts, projects } = await sorted();
  const md = (path: string) => abs(twinPath(path)!);
  return `# ${site.name} (${site.handle})

> ${site.description}

Every page has a Markdown version: add \`.md\` to the URL (\`/blog/x/\` becomes \`/blog/x.md\`, the home page is \`/index.md\`).

## Pages

- [Home](${abs('/index.md')}): about, experience, skills, selected work
- [Tools](${md('/tools/')}): tools grouped by area, with what each was used for
- [Projects](${md('/projects/')}): open source, anonymized studio work, side projects
- [Blog](${md('/blog/')}): technical write-ups
- [Links](${md('/links/')}): profiles and résumé
- [Contact](${md('/contact/')})

## Projects

${projects.map((p) => `- [${p.data.title}](${md(`/projects/${p.id}/`)}): ${p.data.blurb}`).join('\n')}

## Blog

${posts.map((p) => `- [${p.data.title}](${md(`/blog/${p.id}/`)}): ${p.data.description}`).join('\n')}

## Optional

- [Résumé (PDF)](${abs(site.resume)})
- [Sitemap](${abs('/sitemap.xml')})
`;
}
