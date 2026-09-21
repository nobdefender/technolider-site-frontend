import type { Metadata, Viewport } from 'next';
import type React from 'react';
import { Barlow_Condensed, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { MapHost } from '@/components/MapHost';
import { Metrika } from '@/components/Metrika';
import { Nav } from '@/components/Nav';
import { PageEffects } from '@/components/PageEffects';
import { Preloader } from '@/components/Preloader';
import { Scrollbar } from '@/components/Scrollbar';
import { Tiles3D } from '@/components/Tiles3D';
import { TransitionProvider } from '@/components/Transition';
import { seo } from '@/content/seo';
import { site, siteUrl } from '@/content/site';
import { organizationJsonLd, pageMetadata, websiteJsonLd } from '@/lib/seo';

// Шрифты макета: IBM Plex Sans (текст) и Barlow Condensed (заголовки).
// У Barlow Condensed нет кириллицы — как и в макете, кириллические заголовки
// набираются системным шрифтом (system-ui), латиница и цифры — Barlow Condensed.
const plex = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  variable: '--font-barlow-c',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(seo.home),
  title: {
    default: seo.home.title,
    template: `%s — ${site.legalShort}`,
  },
  applicationName: site.name,
  authors: [{ name: site.legalShort, url: siteUrl }],
  creator: site.legalShort,
  publisher: site.legalShort,
  category: 'industrial',
  // Фавиконки генерируются из public/favicon.svg: `npm run icons` (scripts/gen-icons.mjs)
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: '#1d2d3d',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ymId = process.env.NEXT_PUBLIC_YM_ID;
  return (
    <html
      lang="ru"
      className={`${plex.variable} ${barlowCondensed.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Preloader />
        <TransitionProvider>
          <Nav />
          {children}
          <Footer />
        </TransitionProvider>
        <MapHost />
        <PageEffects />
        <Tiles3D />
        <Scrollbar />
        {ymId && <Metrika id={ymId} />}
      </body>
    </html>
  );
}
