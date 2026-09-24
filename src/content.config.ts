import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    // recent = current work, side = hobby/side projects, pre-ai = built before AI tooling
    era: z.enum(['recent', 'side', 'pre-ai']),
    order: z.number().default(100),
    image: z.string(),
    alt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    status: z.enum(['active', 'killed']).default('active'),
    // shown as a small label, e.g. "Open source" or "Client work · anonymized"
    kind: z.string().optional(),
    featured: z.boolean().default(false),
    // the body is the project's own README, rendered as its homepage (see scripts/sync-skill-readmes.mjs)
    readme: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
