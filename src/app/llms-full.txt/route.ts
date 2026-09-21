import { llmsFullTxt } from '@/content/llms';

export const dynamic = 'force-static';

/** /llms-full.txt — полное текстовое содержимое сайта для ИИ-ассистентов. */
export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
