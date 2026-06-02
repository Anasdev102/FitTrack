#!/bin/sh
set -e

if [ -n "$DB_HOST" ]; then
  ENV_FILE=".env.docker"
  SOURCE_ENV=".env"

  if [ ! -f "$SOURCE_ENV" ] && [ -f .env.example ]; then
    SOURCE_ENV=".env.example"
  fi

  if [ -f "$SOURCE_ENV" ]; then
    grep -Ev '^(APP_ENV|APP_DEBUG|APP_URL|FRONTEND_URL|DB_CONNECTION|DB_HOST|DB_PORT|DB_DATABASE|DB_USERNAME|DB_PASSWORD)=' "$SOURCE_ENV" > "$ENV_FILE"
  else
    : > "$ENV_FILE"
  fi

  {
    echo "APP_ENV=${APP_ENV:-local}"
    echo "APP_DEBUG=${APP_DEBUG:-true}"
    echo "APP_URL=${APP_URL:-http://localhost:8001}"
    echo "FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}"
    echo "DB_CONNECTION=${DB_CONNECTION:-mysql}"
    echo "DB_HOST=${DB_HOST}"
    echo "DB_PORT=${DB_PORT:-3306}"
    echo "DB_DATABASE=${DB_DATABASE:-fitmanager}"
    echo "DB_USERNAME=${DB_USERNAME:-fitmanager}"
    echo "DB_PASSWORD=${DB_PASSWORD:-password}"
  } >> "$ENV_FILE"

  echo "Waiting for database at ${DB_HOST}:${DB_PORT:-3306}..."
  until nc -z "$DB_HOST" "${DB_PORT:-3306}"; do
    sleep 2
  done
elif [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

if [ -f artisan ]; then
  if [ -n "$DB_HOST" ]; then
    php artisan key:generate --env=docker --force --no-interaction >/dev/null 2>&1 || true
  else
    php artisan key:generate --force --no-interaction >/dev/null 2>&1 || true
  fi
fi

exec "$@"
