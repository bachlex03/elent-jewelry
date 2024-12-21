FROM node:alpine AS base

FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS development

WORKDIR /app

# ENV NODE_ENV=development
ENV PORT=3001

COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json .

EXPOSE 3001

CMD ["node", "src/index.js"]