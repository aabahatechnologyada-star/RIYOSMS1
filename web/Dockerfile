# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json ./
RUN rm -f pnpm-lock.yaml && pnpm install

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

# Force Tailwind v3 (maxaa yeelay v4 waa la jabin)
RUN pnpm add -D tailwindcss@^3 postcss autoprefixer

# Build
RUN pnpm build

# Stage 3: Production
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm@9

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

USER nextjs

ENV PORT 3000
EXPOSE ${PORT}

CMD ["node", "server"]
