# syntax=docker/dockerfile:1
FROM node:22-alpine 
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install
COPY . .
RUN --mount=type=secret,id=database_url,env=DATABASE_URL \
    npx prisma generate
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]