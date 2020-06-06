FROM node:lts-alpine

RUN npm install -g history-server

WORKDIR /app

COPY ./dist .

EXPOSE 8080
CMD [ "history-server", "./" ]

# FROM nginx:stable

# WORKDIR /app

# COPY ./dist/ /var/www
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]
