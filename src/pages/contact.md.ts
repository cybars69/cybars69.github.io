import { contactMd, markdownResponse } from '../lib/markdown';
export const GET = () => markdownResponse(contactMd());
