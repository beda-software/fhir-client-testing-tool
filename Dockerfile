FROM node:lts as builder

RUN mkdir -p /app/src

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 8080
