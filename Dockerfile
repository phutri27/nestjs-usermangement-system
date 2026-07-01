# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=database_url,env=DATABASE_URL \
    npx prisma generate
RUN npm run build

FROM node:22-alpine AS prod-deps
WORKDIR /app        
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]