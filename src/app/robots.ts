import type { MetadataRoute } from 'next';
import { routes } from '@/content/site';
import { abs } from '@/lib/seo';

const DISALLOW = ['/api/', routes.privacy];

// ИИ-краулеры (ChatGPT, Claude, Perplexity, Gemini, Meta, Apple и т.д.) — разрешаем явно,
// чтобы сайт попадал в ответы ассистентов; llms.txt для них открыт отдельно.
const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'anthropic-ai',
  'Claude-Web',
  'ClaudeBot',
  'PerplexityBot',
  'FacebookBot',
  'Applebot-Extended',
  'cohere-ai',
  'CCBot',
  'Diffbot',
  'Bytespider',
  'Amazonbot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: ['YandexBot', 'Googlebot'], allow: ['/', '/llms.txt', '/llms-full.txt'], disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: ['/', '/llms.txt', '/llms-full.txt'], disallow: DISALLOW },
    ],
    sitemap: abs('/sitemap.xml'),
  };
}
