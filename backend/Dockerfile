FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

RUN apk add --no-cache git unzip icu-dev oniguruma-dev libzip-dev \
    && docker-php-ext-install intl pdo_mysql mbstring zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

CMD php artisan serve --host=0.0.0.0 --port=8001
