FROM nginx:1.19.3-alpine

ARG ENV=prod

COPY backend/_docker/site.conf /etc/nginx/conf.d/site.conf

RUN chmod 644 /etc/nginx/conf.d/site.conf \
    && rm /etc/nginx/conf.d/default.conf

RUN if [ $ENV = "prod" ] ; then \
    sed -i 's/challenge180days-php/challenge180days-prod-php/g' /etc/nginx/conf.d/site.conf ; \
fi ;
