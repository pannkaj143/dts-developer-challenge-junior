# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps && npm cache clean --force

# Build application
COPY tsconfig.json tsconfig.json
COPY prisma prisma
COPY src src
COPY jest.config.ts jest.config.ts

RUN npx prisma generate && npm run build

# Production image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=base /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=base /app/dist dist
COPY prisma prisma

EXPOSE 4000
CMD ["node", "dist/server.js"]
