// Единый источник контактов, реквизитов и настроек, которые в дизайне были
// пропсами (showPhone, servicesLayout) и константами.
export type ServicesLayout = 'row' | 'grid';

export const site = {
  name: 'Технолидер',
  legalShort: 'ООО НПП «Технолидер»',
  legalFull:
    'Общество с ограниченной ответственностью Научно-производственное предприятие «ТЕХНОЛИДЕР»',
  tagline: 'Инжиниринг. Производство. Сборка.',
  phone: '+7 4872 75-92-31',
  phoneHref: 'tel:+74872759231',
  email: 'tehnolidernpp@yandex.ru',
  address: '300028, Тульская область, г. Тула, ул. Болдина, д. 98а, офис 227',
  hours: 'По будням с 09:00 до 18:00',
  inn: '7100072971',
  kpp: '710001001',
  ogrn: '1267100002135',
  year: 2026,
  map: {
    lon: 37.572576,
    lat: 54.172905,
    zoom: 17,
    address: 'ул. Болдина, д. 98а, офис 227 · 300028',
  },
  /** Показывать телефон в шапке (проп showPhone в дизайне). */
  showPhone: true,
  /** Раскладка плиток направлений на главной: 'row' (4 в ряд) | 'grid' (2×2). */
  servicesLayout: 'grid' as ServicesLayout,
} as const;

/** Публичный адрес сайта (для sitemap/robots/метаданных). Задаётся в .env как NEXT_PUBLIC_SITE_URL. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const requisitesText = [
  site.legalFull,
  `ИНН ${site.inn} / КПП ${site.kpp}`,
  `ОГРН ${site.ogrn}`,
  site.address,
].join('\n');

export const mapSrc =
  'https://yandex.ru/map-widget/v1/?ll=' +
  encodeURIComponent(site.map.lon) +
  '%2C' +
  encodeURIComponent(site.map.lat) +
  '&z=' +
  site.map.zoom +
  '&pt=' +
  encodeURIComponent(site.map.lon) +
  '%2C' +
  encodeURIComponent(site.map.lat) +
  '%2Cpm2wtl&lang=ru_RU';

/**
 * Ключ Яндекс Карт JS API (NEXT_PUBLIC_YMAPS_API_KEY).
 * Если задан — карта рисуется через JS API: без рекламного блока и с тёмной темой.
 * Если пуст — используется бесплатный виджет (с рекламой Яндекса).
 */
export const ymapsApiKey = process.env.NEXT_PUBLIC_YMAPS_API_KEY || '';

/** Ссылка на точку в Яндекс Картах (открывается в новой вкладке). */
export const mapLink =
  'https://yandex.ru/maps/?ll=' +
  encodeURIComponent(site.map.lon) +
  '%2C' +
  encodeURIComponent(site.map.lat) +
  '&z=' +
  site.map.zoom +
  '&pt=' +
  encodeURIComponent(site.map.lon) +
  '%2C' +
  encodeURIComponent(site.map.lat) +
  '%2Cpm2wtl&text=' +
  encodeURIComponent(site.address);

/** Маршруты и подписи «шторки» при переходах (labels в дизайне). */
export const routes = {
  home: '/',
  services: '/services',
  antennas: '/services/antennas',
  metal: '/services/metal',
  assembly: '/services/assembly',
  docs: '/services/docs',
  about: '/about',
  contacts: '/contacts',
  privacy: '/privacy',
} as const;

export const routeLabels: Record<string, string> = {
  [routes.home]: 'Главная',
  [routes.services]: 'Услуги',
  [routes.antennas]: 'Антенны',
  [routes.metal]: 'Металлообработка',
  [routes.assembly]: 'Контрактная сборка',
  [routes.docs]: 'Документация',
  [routes.about]: 'О компании',
  [routes.contacts]: 'Контакты',
  [routes.privacy]: 'Политика конфиденциальности',
};

/** Номер листа и подпись для шторки перехода (sectionLabel в макете). */
export const routeSheets: Record<string, { n: string; of: string; kicker: string }> = {
  [routes.home]: { n: '01', of: '08', kicker: 'Главная' },
  [routes.services]: { n: '02', of: '08', kicker: 'Услуги' },
  [routes.antennas]: { n: '03', of: '08', kicker: 'Услуги · Антенны' },
  [routes.metal]: { n: '04', of: '08', kicker: 'Услуги · Металлообработка' },
  [routes.assembly]: { n: '05', of: '08', kicker: 'Услуги · Контрактная сборка' },
  [routes.docs]: { n: '06', of: '08', kicker: 'Услуги · Документация КД, ТД' },
  [routes.about]: { n: '07', of: '08', kicker: 'О компании' },
  [routes.contacts]: { n: '08', of: '08', kicker: 'Контакты' },
  [routes.privacy]: { n: '09', of: '09', kicker: 'Документ' },
};

/** Этапы работы с заказом — секция «Как мы работаем» на главной и разметка schema.org HowTo. */
export const workSteps = [
  { n: '01', t: 'Заявка', p: 'Вы присылаете ТЗ, эскиз или образец.' },
  {
    n: '02',
    t: 'Анализ',
    // «и/или» не должно рваться на строки — вокруг слэша стоит word joiner (U+2060)
    p: 'Мы определяем возможность разработки и\u2060/\u2060или изготовления нашим предприятием и стоимость.',
  },
  { n: '03', t: 'Документация', p: 'Согласовываем чертежи (при необходимости — разрабатываем свои).' },
  { n: '04', t: 'Производство', p: 'Запуск в производство с многоступенчатым контролем ОТК.' },
  { n: '05', t: 'Результат', p: 'Готовое изделие, упакованное и отправленное заказчику.' },
] as const;
