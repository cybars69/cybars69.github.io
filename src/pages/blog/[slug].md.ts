import { getCollection } from 'astro:content';
import { postMd, markdownResponse } from '../../lib/markdown';

export async function getStaticPaths() {
  return (await getCollection('blog')).map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET = ({ props }: { props: { entry: Parameters<typeof postMd>[0] } }) => markdownResponse(postMd(props.entry));
