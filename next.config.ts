import type { NextConfig } from "next";

// Канонический хост из NEXT_PUBLIC_SITE_URL (вшивается при сборке): с www.* редиректим на него,
// чтобы у поисковиков не было дублей страниц.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
const canonicalHost = siteUrl ? new URL(siteUrl).host : '';

const nextConfig: NextConfig = {
  // Для Docker: минимальная сборка со встроенным сервером (.next/standalone/server.js)
  output: 'standalone',
  poweredByHeader: false,
  async redirects() {
    if (!canonicalHost || canonicalHost.startsWith('www.')) return [];
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: `www.${canonicalHost}` }],
        destination: `${siteUrl.replace(/\/$/, '')}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // статика: фото, шрифты и иконки кэшируются надолго
        source: '/photos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
