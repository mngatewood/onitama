# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
	if  [ -f package-lock.json ]; then npm install; \
	else echo "Lockfile not found." && exit 1; \
	fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Ensure Next.js and server files are built
RUN \
	if [ -f package-lock.json ]; then npm run build:socket; \
	else echo "Lockfile not found." && exit 1; \
	fi

# 🔥 Debug: Check if dist/server.mjs exists after build
RUN ls -l /app/dist && cat /app/dist/server.mjs || echo "server.mjs not found!"

# Ensure the dist folder exists
RUN mkdir -p app/dist

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

# Run the server
CMD ["node", "dist/server.mjs"]