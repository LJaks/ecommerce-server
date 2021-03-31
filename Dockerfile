FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-ts

FROM node:12-alpine3.10
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install
ENTRYPOINT [ "node", "dist/server.js" ]