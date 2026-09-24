import { site } from '../data/site';

// Content Signals (https://contentsignals.org): how content may be used once it has been fetched.
//   search   = building a search index and showing links/snippets
//   ai-input = feeding content to an AI model at answer time (RAG, grounding, agents)
//   ai-train = training or fine-tuning models
// These are preferences, not access control. Change the values here to change the policy.
const signals = { search: 'yes', 'ai-input': 'yes', 'ai-train': 'no' };

export const GET = () =>
  new Response(
    [
      'User-agent: *',
      `Content-Signal: ${Object.entries(signals).map(([k, v]) => `${k}=${v}`).join(', ')}`,
      'Allow: /',
      '',
      `Sitemap: ${site.url}/sitemap.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
