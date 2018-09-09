FROM nginx:1.15.3
COPY ./docker-indigo.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
CMD nginx -g 'daemon off;'
