import { toolsMd, markdownResponse } from '../lib/markdown';
export const GET = () => markdownResponse(toolsMd());
