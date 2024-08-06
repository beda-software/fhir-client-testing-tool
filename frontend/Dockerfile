FROM node:lts as builder

RUN mkdir -p /app/src

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000
