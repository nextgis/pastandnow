FROM node:lts-alpine

RUN npm install -g history-server

WORKDIR /app

COPY ./dist .

EXPOSE 8080
CMD [ "history-server", "./" ]


# FROM nginx:stable

# COPY ./dist/ /var/www
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# CMD ["nginx", "-g", "daemon off;"]
