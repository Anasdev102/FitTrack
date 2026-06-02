# MySQL Deployment Guide

## Required Environment Variables

Use MySQL for the main FitManager application environment:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=fitmanager
DB_USERNAME=fitmanager
DB_PASSWORD=secret
```

For local non-Docker development, use `DB_HOST=127.0.0.1` if MySQL is running on the host machine.

SQLite is reserved only for automated tests through `phpunit.xml`.

## Local MySQL Setup

Create the database and user before running migrations:

```sql
CREATE DATABASE IF NOT EXISTS fitmanager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'fitmanager'@'localhost' IDENTIFIED BY 'secret';
CREATE USER IF NOT EXISTS 'fitmanager'@'127.0.0.1' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON fitmanager.* TO 'fitmanager'@'localhost';
GRANT ALL PRIVILEGES ON fitmanager.* TO 'fitmanager'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Then run:

```bash
cd backend
php artisan config:clear
php artisan migrate:fresh --seed
```

## Docker Deployment

The root `docker-compose.yml` includes:

- `backend` Laravel API on port `8001`
- `frontend` Vite app on port `5173`
- `mysql` MySQL 8 on port `3306`
- `phpmyadmin` on port `8080`

Run:

```bash
docker compose up -d --build
docker compose exec backend php artisan migrate --seed
```

If an old Docker MySQL volume was created with a different password, recreate the volume or update the database user manually before using the new `DB_PASSWORD=secret` value.

## Railway Notes

1. Add a MySQL database service.
2. Set Laravel environment variables from the Railway MySQL connection values.
3. Use `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` from Railway.
4. Run migrations after deployment:

```bash
php artisan migrate --force
php artisan db:seed --force
```

## Render Notes

1. Use an external MySQL provider or a managed database service.
2. Set the backend service environment variables to the MySQL connection values.
3. Run:

```bash
php artisan migrate --force
```

Use `php artisan db:seed --force` only when initializing a fresh deployment.

## Production Checklist

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY` is generated and stable
- `DB_CONNECTION=mysql`
- MySQL user has privileges only on the FitManager database
- Run `php artisan migrate --force`
- Do not commit `.env`, `vendor`, `node_modules`, database files, or build artifacts
