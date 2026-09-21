import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для Docker: минимальная сборка со встроенным сервером (.next/standalone/server.js)
  output: 'standalone',
  poweredByHeader: false,
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
