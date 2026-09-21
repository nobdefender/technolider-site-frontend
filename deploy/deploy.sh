#!/usr/bin/env bash
# Ручной деплой на сервере: обновить код и пересобрать контейнер.
# Запуск из корня проекта на сервере:  bash deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Нет файла .env — скопируйте .env.example в .env и заполните NEXT_PUBLIC_SITE_URL" >&2
  exit 1
fi

if [ -d .git ]; then
  git pull --ff-only
fi

docker compose build --pull
docker compose up -d
docker image prune -f >/dev/null

echo "Ожидание готовности…"
for i in $(seq 1 30); do
  status=$(docker inspect -f '{{.State.Health.Status}}' technolider-site 2>/dev/null || echo starting)
  if [ "$status" = "healthy" ]; then
    echo "Готово: контейнер technolider-site работает (healthy)."
    exit 0
  fi
  sleep 2
done
echo "Контейнер не стал healthy за 60 с — смотрите: docker compose logs --tail=100" >&2
exit 1
