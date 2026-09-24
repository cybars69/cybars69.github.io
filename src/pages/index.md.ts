import { homeMd, markdownResponse } from '../lib/markdown';
export const GET = async () => markdownResponse(await homeMd());
