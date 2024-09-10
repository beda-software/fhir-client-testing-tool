FROM node:lts as builder

RUN mkdir -p /app/src

WORKDIR /app

COPY . .

RUN yarn install

WORKDIR /app/packages/app

EXPOSE 8080
