import { getCollection } from 'astro:content';
import { site } from '../data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET = async () => {
  const posts = await getCollection('blog');
  const projects = await getCollection('projects');
  const urls: { loc: string; lastmod?: string }[] = [
    ...['/', '/projects/', '/blog/', '/tools/', '/links/', '/contact/'].map((p) => ({ loc: p })),
    ...projects.map((p) => ({ loc: `/projects/${p.id}/` })),
    ...posts.map((p) => ({ loc: `/blog/${p.id}/`, lastmod: p.data.date.toISOString().slice(0, 10) })),
  ];
  const body = urls
    .map((u) => `  <url><loc>${esc(site.url + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
