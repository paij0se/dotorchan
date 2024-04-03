FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
CMD [ "npm","run","preview","--","--host" ]