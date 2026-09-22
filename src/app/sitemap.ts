import type { MetadataRoute } from 'next';
import { seo } from '@/content/seo';
import { images } from '@/content/images';
import { abs } from '@/lib/seo';

// Дата последнего изменения контента — фиксируется на момент сборки.
const lastModified = new Date();

const pageImages: Partial<Record<keyof typeof seo, (keyof typeof images)[]>> = {
  home: ['v2-about-photo', 'v2-shop-1', 'v2-shop-2', 'v2-shop-3'],
  antennas: ['v2-antennas-hero'],
  metal: ['v2-metal-hero'],
  assembly: ['v2-assembly-hero'],
  docs: ['v2-docs-hero'],
  about: ['v2-about-hero'],
};

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(seo) as (keyof typeof seo)[])
    .filter((key) => !seo[key].noindex)
    .map((key) => {
      const p = seo[key];
      const imgs = (pageImages[key] || []).map((id) => images[id]).filter(Boolean) as string[];
      return {
        url: abs(p.path),
        lastModified,
        changeFrequency: p.changeFrequency,
        priority: p.priority,
        ...(imgs.length ? { images: imgs.map((src) => abs(src)) } : {}),
      };
    });
}
