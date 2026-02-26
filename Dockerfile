FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

# --- Зависимости ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Seed (source + deps, без build) ---
FROM base AS seeder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- Сборка (без подключения к БД — compile only) ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV PAYLOAD_SECRET=build-time-secret-not-used
RUN npx next build --experimental-build-mode compile

# --- Production ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN mkdir -p uploads && chown nextjs:nodejs uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
