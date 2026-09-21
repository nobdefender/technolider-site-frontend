import type { MetadataRoute } from 'next';
import { routes } from '@/content/site';
import { abs } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', routes.privacy] },
      // Поисковики и ИИ-краулеры: llms.txt разрешён явно
      { userAgent: ['GPTBot', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'YandexBot', 'Googlebot'], allow: ['/', '/llms.txt', '/llms-full.txt'], disallow: ['/api/'] },
    ],
    sitemap: abs('/sitemap.xml'),
  };
}
