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
    background_color: '#1d2d3d',
    theme_color: '#1d2d3d',
    // PNG с полем вокруг рисунка — подходят и как обычная иконка, и как maskable (Android)
    icons: [
      { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
