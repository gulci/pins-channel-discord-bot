# Install dependencies only when needed
FROM node:16-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build:release

# Production image, copy all the files and run app
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nodejs:nodejs /app/build ./

USER nodejs

CMD ["node", "main.js"]
