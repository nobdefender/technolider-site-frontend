import { llmsTxt } from '@/content/llms';

export const dynamic = 'force-static';

/** /llms.txt — краткое описание сайта для ИИ-ассистентов (llmstxt.org). */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
