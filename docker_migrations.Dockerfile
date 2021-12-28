FROM php:7.4.27-cli

ENV TZ=Europe/Oslo

RUN cd /usr/src \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && echo "date.timezone = $TZ" > /usr/local/etc/php/conf.d/timezone.ini \
    && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY backend/src /code/src
COPY backend/phinx /code/phinx
COPY backend/vendor /code/vendor
COPY backend/database /code/database

CMD /code/vendor/bin/phinx migrate -c /code/phinx/config.php
