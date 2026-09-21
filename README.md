# technolider-site-frontend — сайт ООО НПП «Технолидер»

Next.js 16 (App Router, TypeScript), three.js для 3D-объектов. Вёрстка перенесена
один в один из макета Claude Design «Technolider Site v2».

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка
npm start        # запуск собранного сайта
```

## Структура

```
Dockerfile, docker-compose.yml   контейнер (Next.js standalone, node:22-alpine)
deploy/                  пример nginx и скрипт обновления на сервере
src/app/                 маршруты
  page.tsx               главная
  services/              услуги (+ antennas, metal, assembly, docs)
  about/  contacts/  privacy/
  api/lead/route.ts      приём заявки с формы
  api/health/route.ts    проверка живости (Docker healthcheck)
  globals.css            дизайн-система «Industry» + стили макета
src/components/          шапка, подвал, шторка переходов, прелоадер, 3D, форма…
src/lib/tiles3d.js       кастомный элемент <tile-3d> (three.js) из макета
src/content/site.ts      контакты, реквизиты, карта, настройки (телефон в шапке,
                         раскладка плиток, фоновое видео)
src/content/images.ts    фотографии для слотов макета
```

## Что нужно доделать перед публикацией

1. **Фотографии.** В макете все слоты изображений пустые (плейсхолдеры).
   Положите файлы в `public/photos/` и пропишите пути в `src/content/images.ts`,
   например `'v2-about-1': '/photos/shop.jpg'`. Главный экран — без фото/видео,
   только градиент и 3D-модель.
2. **Форма заявки.** Правила проверки полей — в `src/lib/lead.ts` (общие для клиента и сервера). `src/app/api/lead/route.ts` сейчас только валидирует данные
   и пишет их в лог сервера. Подключите отправку на почту (nodemailer/SMTP) или
   в CRM.
3. **Капча.** Блок «Я не робот · SmartCaptcha» в макете — визуальная заглушка
   (обычный чекбокс). Для реальной защиты подключите Yandex SmartCaptcha.
4. **Адрес сайта и счётчики.** Скопируйте `.env.example` в `.env` и укажите
   `NEXT_PUBLIC_SITE_URL` (нужен для canonical, Open Graph, `sitemap.xml`,
   `robots.txt`, `llms.txt`), номер счётчика Яндекс Метрики `NEXT_PUBLIC_YM_ID`
   и коды подтверждения Яндекс Вебмастера / Google Search Console.

## Деплой на сервер (Docker, вручную)

Полная пошаговая инструкция — в [DEPLOY.md](DEPLOY.md) (репозиторий → Docker → nginx рядом
с другим сайтом → HTTPS → обновления). Ниже — краткая версия.

Нужны: сервер с Docker 24+ и `docker compose` (плагин v2), nginx для HTTPS.

**Первый запуск**

```bash
# на сервере
git clone <репозиторий> /opt/technolider-site-frontend && cd /opt/technolider-site-frontend   # или скопируйте папку по scp/rsync
cp .env.example .env && nano .env      # NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru (+ счётчики, если есть)
docker compose up -d --build           # сборка ~2–3 мин, контейнер слушает 127.0.0.1:3000
curl -s http://127.0.0.1:3000/api/health   # → {"ok":true,...}
```

Затем nginx: скопируйте `deploy/nginx.conf.example` в `/etc/nginx/sites-available/technolider`,
замените домен, включите сайт и выпустите сертификат (`certbot --nginx`).

**Обновление**

```bash
cd /opt/technolider-site-frontend && bash deploy/deploy.sh   # git pull → пересборка → перезапуск → проверка healthcheck
```

Если на сервере нет доступа к репозиторию, соберите образ локально и перенесите файлом:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru -t technolider-site-frontend:latest .
docker save technolider-site-frontend:latest | gzip > technolider-site-frontend.tar.gz
scp technolider-site-frontend.tar.gz user@server:/opt/technolider-site-frontend/
# на сервере:
docker load < technolider-site-frontend.tar.gz && docker compose up -d
```

Полезное: `docker compose logs -f` — логи (сюда же пишутся заявки с формы, пока не
подключена почта); `SITE_PORT=3001` в `.env` — если порт 3000 занят. Переменные
`NEXT_PUBLIC_*` вшиваются в сборку, поэтому после их изменения нужен `--build`.

## SEO

- Метаданные страниц (title, description, canonical, Open Graph, Twitter) —
  в `src/content/seo.ts`; собираются функцией `pageMetadata()` из `src/lib/seo.ts`.
- Разметка schema.org (JSON-LD): `Organization` + `LocalBusiness` и `WebSite`
  в layout; `BreadcrumbList`, `Service`, `AboutPage`, `ContactPage`,
  `CollectionPage` на страницах (`src/lib/seo.ts`, компонент `JsonLd`).
- `sitemap.xml` (с картинками), `robots.txt`, `manifest.webmanifest`,
  `/llms.txt` и `/llms-full.txt` (описание сайта для ИИ-ассистентов,
  формат llmstxt.org) — генерируются из `src/content/*`.
- Open Graph картинка `public/og.png` (1200×630) и логотип `public/logo.png`
  (512×512) — статические файлы; при смене бренда перерисуйте их.
- Политика конфиденциальности закрыта от индексации (`noindex, follow`),
  страница 404 — тоже.
- Alt-тексты фотографий — `imageAlts` в `src/content/images.ts`.
- Яндекс Метрика подключается только при заданном `NEXT_PUBLIC_YM_ID` и
  считает переходы между страницами (SPA).

## Замечание о шрифтах

Макет использует Barlow Condensed для заголовков. У этого шрифта нет кириллицы,
поэтому русские заголовки (как и в самом макете) набираются системным шрифтом
(`system-ui`), а цифры и латиница — Barlow Condensed. Если нужен единый
кириллический шрифт заголовков, замените `Barlow_Condensed` в
`src/app/layout.tsx` (например, на Roboto Condensed или Oswald).
