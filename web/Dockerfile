# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package.json
COPY package.json ./

# TIRIRTIR lockfile-ka hore si looga fogaado version-ka duugoobay
# Kadib ku rakib dhammaan packages-ka (lockfile cusub ayaa la samayn)
RUN rm -f pnpm-lock.yaml && pnpm install

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy all files
COPY . .

# Force upgrade next to secure version if needed
RUN pnpm add next@^14.2.35

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
