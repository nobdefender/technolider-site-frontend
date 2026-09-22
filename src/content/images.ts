// Слоты изображений из дизайна (image-slot id → путь к файлу в /public).
// В дизайне все слоты пустые (плейсхолдеры). Чтобы подставить фото,
// положите файл в public/photos и укажите путь здесь, например:
//   'v2-shop-1': '/photos/shop.jpg'
export const images: Partial<Record<ImageSlotId, string>> = {
  'v2-about-photo': '/photos/about-workshop.webp',
  'v2-shop-1': '/photos/shop-hall.webp',
  'v2-shop-2': '/photos/shop-crane.webp',
  'v2-shop-3': '/photos/shop-drill.webp',
  'v2-antennas-hero': '/photos/antennas-chamber.webp',
  'v2-metal-hero': '/photos/metal-laser.webp',
  'v2-assembly-hero': '/photos/assembly-smt.webp',
  'v2-docs-hero': '/photos/docs-drawings.webp',
  'v2-about-hero': '/photos/about-hall.webp',
};

/** Alt-тексты фотографий (для поисковиков и скринридеров). */
export const imageAlts: Partial<Record<ImageSlotId, string>> = {
  'v2-about-photo': 'Сварочные работы на производственном участке',
  'v2-shop-1': 'Производственный цех со станочным парком и стеллажами заготовок',
  'v2-shop-2': 'Кран-балка над заготовками на сборочном участке',
  'v2-shop-3': 'Сверлильная головка станка крупным планом',
  'v2-antennas-hero': 'Логопериодическая антенна в безэховой камере при настройке диаграммы направленности',
  'v2-metal-hero': 'Лазерная резка металлического листа',
  'v2-assembly-hero': 'Монтаж SMD-компонентов на печатную плату',
  'v2-docs-hero': 'Инженеры работают с чертежами деталей',
  'v2-about-hero': 'Рабочий в каске в производственном цехе',
};

/** Точка привязки кадра (CSS object-position), если важная часть снимка не по центру. */
export const imagePositions: Partial<Record<ImageSlotId, string>> = {
  'v2-about-hero': '50% 15%',
};

export type ImageSlotId =
  | 'v2-about-photo'
  | 'v2-shop-1'
  | 'v2-shop-2'
  | 'v2-shop-3'
  | 'v2-antennas-hero'
  | 'v2-metal-hero'
  | 'v2-assembly-hero'
  | 'v2-docs-hero'
  | 'v2-about-hero';
