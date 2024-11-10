FROM nginx:alpine AS base
WORKDIR /usr/share/nginx/html

FROM node:lts AS build
WORKDIR /build
COPY package.json /build/package.json
COPY package-lock.json /build/package-lock.json
ARG BASE_URL
ENV VITE_BASE_URL=${BASE_URL}
RUN npm i
COPY . /build
RUN npm run build

FROM base AS deploy
WORKDIR /usr/share/nginx/html
COPY --from=build /build/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf ./*
COPY --from=build /build/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
