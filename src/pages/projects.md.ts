import { projectsIndexMd, markdownResponse } from '../lib/markdown';
export const GET = async () => markdownResponse(await projectsIndexMd());
