import { getCollection } from 'astro:content';
import { projectMd, markdownResponse } from '../../lib/markdown';

export async function getStaticPaths() {
  return (await getCollection('projects')).map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET = ({ props }: { props: { entry: Parameters<typeof projectMd>[0] } }) => markdownResponse(projectMd(props.entry));
