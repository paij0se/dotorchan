FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build
CMD [ "npm","run","preview","--","--host" ]