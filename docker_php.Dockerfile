FROM php:7.4.27-fpm

ENV TZ=Europe/Oslo

RUN cd /usr/src \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && echo "date.timezone = $TZ" > /usr/local/etc/php/conf.d/timezone.ini \
    && apt-get update \
    && apt-get install -y --fix-missing apt-utils gnupg \
    && echo "deb http://packages.dotdeb.org jessie all" >> /etc/apt/sources.list \
    && echo "deb-src http://packages.dotdeb.org jessie all" >> /etc/apt/sources.list \
    && curl -sS --insecure https://www.dotdeb.org/dotdeb.gpg | apt-key add - \
    && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY backend/src /code/src
COPY backend/entrypoint /code/entrypoint
COPY backend/vendor /code/vendor
COPY backend/database /code/database
