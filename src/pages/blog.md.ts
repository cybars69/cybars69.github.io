import { blogIndexMd, markdownResponse } from '../lib/markdown';
export const GET = async () => markdownResponse(await blogIndexMd());
