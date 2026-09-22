# Развёртывание technolider-site-frontend на сервере

Пошаговая инструкция: от репозитория до работающего сайта по HTTPS рядом с уже существующим
сайтом на nginx. Рассчитана на Ubuntu 22.04/24.04 или Debian 12; для других дистрибутивов
отличаются только команды установки пакетов.

Схема: сайт работает в Docker-контейнере и слушает только `127.0.0.1:3000`; наружу (80/443)
его отдаёт ваш существующий nginx как ещё один виртуальный хост. Другой сайт не затрагивается.

---

## 0. Положить проект в репозиторий (один раз, на своём компьютере)

Если проект ещё не в git:

```bash
cd D:\proton\technolider-site        # локальная папка проекта; репозиторий — technolider-site-frontend
git init
git add .
git commit -m "Сайт Технолидер"
git branch -M main
git remote add origin git@github.com:<ваш-аккаунт>/technolider-site-frontend.git   # или GitLab / Gitea / Bitbucket
git push -u origin main
```

`.env`, `node_modules`, `.next` в репозиторий не попадают (они в `.gitignore`). Файлы ТЗ
(`tz.pdf`, `Для сайта.pdf` и т.д.) попадут — если не нужно, удалите их из папки перед `git add`.

Если репозиторий приватный, на сервере понадобится доступ к нему: проще всего создать на
сервере SSH-ключ (`ssh-keygen -t ed25519`) и добавить `~/.ssh/id_ed25519.pub` в настройки
репозитория как **Deploy key** (только чтение).

> Без git тоже можно: скопировать папку на сервер командой
> `rsync -av --exclude node_modules --exclude .next --exclude .env ./ user@server:/opt/technolider-site-frontend/`
> и дальше выполнять шаги с п. 3.

---

## 1. Подключиться к серверу и поставить Docker

```bash
ssh user@your-server
```

Проверьте, есть ли Docker:

```bash
docker --version && docker compose version
```

Если нет — установите официальным способом:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # чтобы запускать docker без sudo
newgrp docker                      # или перелогиньтесь
docker compose version             # должно быть v2.24 или новее
```

Также нужен git: `sudo apt install -y git`.

---

## 2. Скачать репозиторий

```bash
sudo mkdir -p /opt/technolider-site-frontend && sudo chown $USER:$USER /opt/technolider-site-frontend
git clone git@github.com:nobdefender/technolider-site-frontend.git /opt/technolider-site-frontend
cd /opt/technolider-site-frontend
```

---

## 3. Настроить переменные окружения

```bash
cp .env.example .env
nano .env
```

Обязательно заполните:

```ini
NEXT_PUBLIC_SITE_URL=https://npp-technolider.ru   # без слэша в конце
```

По желанию:

```ini
NEXT_PUBLIC_YM_ID=12345678                    # номер счётчика Яндекс Метрики
NEXT_PUBLIC_YANDEX_VERIFICATION=...           # из Яндекс Вебмастера
NEXT_PUBLIC_GOOGLE_VERIFICATION=...           # из Google Search Console
SITE_PORT=3000                                # порт на 127.0.0.1 для nginx
```

Форма заявки отправляется на бэкенд (репозиторий `technolider-site-backend`, ставится
отдельно — см. его `DEPLOY.md`):

```ini
NEXT_PUBLIC_API_URL=                          # пусто — тот же домен: nginx проксирует /api/ на бэкенд
NEXT_PUBLIC_SMARTCAPTCHA_KEY=                 # клиентский ключ Yandex SmartCaptcha (пусто — чекбокс для стенда)
NEXT_PUBLIC_YMAPS_API_KEY=                    # ключ Яндекс Карт: карта без рекламы, тёмная тема
```

Пока бэкенд не поднят, форма будет отвечать «Не удалось отправить» — это ожидаемо.

Пока сайт не запущен публично, он закрыт HTTP Basic Auth (браузер спросит логин и пароль):

```ini
BASIC_AUTH=on                                 # off — открыть сайт для всех
BASIC_AUTH_USER=proton
BASIC_AUTH_PASS=proton
```

Эти переменные читаются при старте контейнера — после их изменения достаточно
`docker compose up -d` без пересборки. Healthcheck `/api/health` пароля не требует.
Боты превью ссылок (Telegram, WhatsApp, VK, Max) пропускаются без пароля, чтобы у ссылки
была OG-картинка (`BASIC_AUTH_ALLOW_PREVIEW=off` — запретить). Поисковики под паролем
получают 401 — перед публичным запуском поставьте `BASIC_AUTH=off`.

Проверьте, что порт свободен (другой сайт мог занять 3000):

```bash
ss -ltnp | grep ':3000'          # пусто — порт свободен
```

Если занят — поставьте `SITE_PORT=3001` и дальше везде используйте 3001.

> `NEXT_PUBLIC_*` вшиваются в сборку. После их изменения нужно пересобрать:
> `docker compose up -d --build`.

---

## 4. Собрать и запустить контейнер

```bash
docker compose up -d --build
```

Сборка занимает 2–4 минуты (скачивание образа Node, `npm ci`, `next build`). Проверка:

```bash
docker compose ps                                   # technolider-site-frontend … Up (healthy)
curl -s http://127.0.0.1:3000/api/health            # {"ok":true,...}
curl -s -o /dev/null -w '%{http_code}
' http://127.0.0.1:3000/            # 401 — сайт под паролем
curl -s -u proton:proton http://127.0.0.1:3000/ | head -c 300               # HTML главной
```

Если что-то не так: `docker compose logs --tail=100`.

---

## 5. Добавить сайт в nginx (существующий сайт не трогаем)

Создайте отдельный конфиг:

```bash
sudo nano /etc/nginx/sites-available/technolider
```

Содержимое (замените домен; полный вариант с gzip — в `deploy/nginx.conf.example`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name npp-technolider.ru www.npp-technolider.ru;

    # форма заявки → бэкенд (repo technolider-site-backend); блок обязательно до "location /"
    location /api/ {
        proxy_pass         http://127.0.0.1:4000/api/;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        client_max_body_size 20m;                     # вложения: 3 файла по 5 МБ
    }

    location / {
        proxy_pass         http://127.0.0.1:3000;     # SITE_PORT из .env
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location /_next/static/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_set_header   Host $host;
        add_header         Cache-Control "public, max-age=31536000, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    client_max_body_size 5m;
}
```

Включите и перезагрузите nginx (`reload`, не `restart` — второй сайт не прервётся):

```bash
sudo ln -s /etc/nginx/sites-available/technolider /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Если конфиги nginx у вас лежат в `/etc/nginx/conf.d/` (нет папки `sites-available`) —
сохраните файл как `/etc/nginx/conf.d/technolider.conf`, симлинк не нужен.

Убедитесь, что у второго сайта в его конфиге тоже указан свой `server_name` — команда
показывает итоговый конфиг nginx со всеми подключёнными файлами, где бы они ни лежали:

```bash
sudo nginx -T 2>/dev/null | grep -E '^\s*(include|server_name)'
```

nginx разводит запросы по домену, поэтому сайты не пересекаются.

> Блок `location /api/` нужен только когда поднят бэкенд (`technolider-site-backend`).
> Пока его нет — уберите этот блок, иначе форма будет получать 502.

Если `server_name` второго сайта там есть, а строки `include /etc/nginx/sites-enabled/*` нет —
значит, его конфиг вписан прямо в `nginx.conf`. Тогда положите наш файл в
`/etc/nginx/conf.d/technolider.conf` (эта папка подключается почти всегда) или добавьте
`include /etc/nginx/sites-enabled/*;` внутрь блока `http { … }` в `/etc/nginx/nginx.conf`.

Если на 80/443 вообще не nginx с хоста (`sudo ss -ltnp | grep -E ':80 |:443 '` показывает
`docker-proxy`, `apache2`, `caddy`), схема другая: для Docker-прокси нужно подключить наш
контейнер в его сеть и проксировать на `technolider-site-frontend:3000`, для Apache —
`ProxyPass / http://127.0.0.1:3000/`, для Caddy — `reverse_proxy 127.0.0.1:3000`.

---

## 6. DNS

У регистратора домена создайте A-записи на IP сервера:

| Имя   | Тип | Значение     |
|-------|-----|--------------|
| `@`   | A   | IP сервера   |
| `www` | A   | IP сервера   |

Подождите, пока DNS обновится (обычно 5–30 минут), и проверьте:

```bash
curl -I http://npp-technolider.ru        # HTTP/1.1 200 OK
```

---

## 7. HTTPS (Let's Encrypt)

Если certbot ещё не установлен:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Выпустить сертификат (certbot сам допишет `listen 443 ssl` и редирект с http в конфиг
именно этого сайта; сертификат второго сайта не изменится):

```bash
sudo certbot --nginx -d npp-technolider.ru -d www.npp-technolider.ru
```

Автопродление проверяется командой `sudo certbot renew --dry-run`.

---

## 8. Финальная проверка

```bash
curl -I https://npp-technolider.ru                                               # 200
curl -s https://npp-technolider.ru | grep -o '<link rel="canonical"[^>]*>'       # ваш домен
curl -s https://npp-technolider.ru/robots.txt                                    # Sitemap: https://npp-technolider.ru/sitemap.xml
curl -s https://npp-technolider.ru/llms.txt | head -3
docker compose ps                                                            # healthy
```

Откройте сайт в браузере и отправьте тестовую заявку на странице «Контакты».
Форма шлёт `POST /api/leads` на бэкенд, поэтому проверять результат нужно там:

```bash
curl -s https://npp-technolider.ru/api/health                                 # {"ok":true,...}
cd /opt/technolider-site-backend && docker compose logs -f api | tail -20     # приём заявки
```

Заявка сохраняется в базе бэкенда, уходит на почту и в Telegram. Если бэкенд ещё не
поднят, форма покажет «Не удалось отправить» — см. `DEPLOY.md` в `technolider-site-backend`.

---

## 9. После запуска (SEO)

1. Добавьте сайт в [Яндекс Вебмастер](https://webmaster.yandex.ru) и
   [Google Search Console](https://search.google.com/search-console). Код подтверждения
   можно вписать в `.env` (`NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`)
   и пересобрать, либо подтвердить через DNS.
2. Отправьте `https://npp-technolider.ru/sitemap.xml` в обоих сервисах.
3. Заведите карточку в [Яндекс Бизнесе](https://business.yandex.ru) — для локальной выдачи
   по Туле это важнее любых тегов.
4. Проверьте превью ссылки в мессенджерах (Telegram: `@WebpageBot` → отправить ссылку).

---

## Обновление сайта

После правок в коде и `git push`:

```bash
ssh user@your-server
cd /opt/technolider-site-frontend
bash deploy/deploy.sh
```

Скрипт делает `git pull`, пересобирает образ, перезапускает контейнер и ждёт статуса
`healthy`. Простой при обновлении — несколько секунд (пока новый контейнер стартует).

Вручную то же самое:

```bash
git pull && docker compose up -d --build && docker image prune -f
```

---

## Если на сервере нет доступа к репозиторию

Соберите образ на своём компьютере и перенесите файлом:

```bash
# локально (Docker Desktop)
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://npp-technolider.ru -t technolider-site-frontend:latest .
docker save technolider-site-frontend:latest | gzip > technolider-site-frontend.tar.gz
scp technolider-site-frontend.tar.gz docker-compose.yml .env user@server:/opt/technolider-site-frontend/

# на сервере
cd /opt/technolider-site-frontend
docker load < technolider-site-frontend.tar.gz
docker compose up -d          # без --build: образ уже загружен
```

---

## Полезные команды

| Задача                          | Команда                                              |
|---------------------------------|------------------------------------------------------|
| Логи                            | `docker compose logs -f --tail=200`                  |
| Перезапуск без пересборки       | `docker compose restart`                             |
| Остановить сайт                 | `docker compose down`                                |
| Состояние контейнера            | `docker compose ps`, `docker stats technolider-site-frontend` |
| Проверить конфиг nginx          | `sudo nginx -t`                                      |
| Освободить место от старых образов | `docker image prune -f`                           |

## Частые проблемы

- **502 Bad Gateway** — контейнер не запущен или слушает другой порт: `docker compose ps`,
  сверьте `SITE_PORT` в `.env` и `proxy_pass` в nginx.
- **В `og:image`/canonical — `localhost:3000`** — при сборке не был задан
  `NEXT_PUBLIC_SITE_URL`; проверьте `.env` и выполните `docker compose up -d --build`.
- **Порт 3000 занят** — `ss -ltnp | grep 3000`; поставьте `SITE_PORT=3001` в `.env` и
  поправьте `proxy_pass`.
- **Сертификат не выпускается** — домен ещё не указывает на сервер (`dig +short npp-technolider.ru`)
  или порт 80 закрыт файрволом (`sudo ufw status`).
- **Нет прав на docker** — `sudo usermod -aG docker $USER` и перелогиниться.
