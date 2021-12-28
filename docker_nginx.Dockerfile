FROM nginx:1.19.3-alpine

ARG ENV=prod

COPY backend/_docker/site.conf /etc/nginx/conf.d/site.conf

RUN chmod 644 /etc/nginx/conf.d/site.conf \
    && rm /etc/nginx/conf.d/default.conf

RUN if [ $ENV = "prod" ] ; then \
    sed -i 's/challenge180days2022-php/challenge180days2022-prod-php/g' /etc/nginx/conf.d/site.conf ; \
fi ;
