import type { Metadata } from 'next';
import { knowsAbout, seo, services, type PageSeo } from '@/content/seo';
import { routes, site, siteUrl, workSteps } from '@/content/site';

export const abs = (path: string) => new URL(path, siteUrl).toString();

// Абсолютный URL обязателен: Telegram/VK/WhatsApp не резолвят относительные og:image.
const OG_IMAGE = {
  url: abs('/og.png'),
  secureUrl: abs('/og.png'),
  type: 'image/png',
  width: 1200,
  height: 630,
  alt: `${site.legalShort} — ${site.tagline}`,
};

/** Метаданные страницы: title, description, keywords, canonical, Open Graph, Twitter, robots. */
export function pageMetadata(p: PageSeo): Metadata {
  return {
    title: { absolute: p.title },
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: p.path },
    openGraph: {
      type: 'website',
      url: abs(p.path),
      title: p.title,
      description: p.description,
      siteName: site.legalShort,
      locale: 'ru_RU',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description,
      images: [OG_IMAGE.url],
    },
    robots: p.noindex ? { index: false, follow: true } : undefined,
  };
}

// ── schema.org ────────────────────────────────────────────────────────────
const ORG_ID = abs('/#organization');
const SITE_ID = abs('/#website');

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.legalShort,
    alternateName: site.name,
    legalName: site.legalFull,
    url: siteUrl,
    logo: abs('/logo.png'),
    image: abs('/og.png'),
    telephone: site.phone.replace(/[^\d+]/g, ''),
    email: site.email,
    description: seo.home.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Болдина, д. 98а, офис 227',
      addressLocality: 'Тула',
      addressRegion: 'Тульская область',
      postalCode: '300028',
      addressCountry: 'RU',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.map.lat, longitude: site.map.lon },
    hasMap: 'https://yandex.ru/maps/?ll=' + site.map.lon + '%2C' + site.map.lat + '&z=' + site.map.zoom,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    taxID: site.inn,
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'ИНН', value: site.inn },
      { '@type': 'PropertyValue', propertyID: 'КПП', value: site.kpp },
      { '@type': 'PropertyValue', propertyID: 'ОГРН', value: site.ogrn },
    ],
    areaServed: { '@type': 'Country', name: 'Россия' },
    knowsAbout,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(routes[s.key]) },
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: siteUrl,
    name: site.legalShort,
    inLanguage: 'ru-RU',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function serviceJsonLd(key: (typeof services)[number]['key']) {
  const s = services.find((x) => x.key === key)!;
  const page = seo[key];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': abs(page.path + '#service'),
    name: s.name,
    serviceType: s.serviceType,
    description: page.description,
    url: abs(page.path),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Россия' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: s.name,
      itemListElement: s.items.map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}

export function webPageJsonLd(type: 'AboutPage' | 'ContactPage' | 'CollectionPage', p: PageSeo) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    url: abs(p.path),
    name: p.title,
    description: p.description,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'ru-RU',
  };
}

/** Этапы работы с заказом (секция «Как мы работаем» на главной). */
export function howToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': abs('/#howto'),
    name: 'Как заказать разработку или изготовление в НПП «Технолидер»',
    description:
      'От заявки с ТЗ, эскизом или образцом до готового изделия: анализ, согласование документации, производство с контролем ОТК, отгрузка.',
    inLanguage: 'ru-RU',
    step: workSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.t,
      // word joiner (U+2060) — только для вёрстки, в разметку не нужен
      text: s.p.replace(/\u2060/g, ''),
    })),
  };
}
