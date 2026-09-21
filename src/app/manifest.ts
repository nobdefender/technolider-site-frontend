import type { MetadataRoute } from 'next';
import { seo } from '@/content/seo';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.legalShort,
    short_name: site.name,
    description: seo.home.description,
    start_url: '/',
    display: 'standalone',
    lang: 'ru',
    background_color: '#f2f2f3',
    theme_color: '#1d2d3d',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
