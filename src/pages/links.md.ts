import { linksMd, markdownResponse } from '../lib/markdown';
export const GET = () => markdownResponse(linksMd());
