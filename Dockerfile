# Base stage
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/*/package.json apps/*/
COPY packages/*/package.json packages/*/
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/*/node_modules ./apps/*/node_modules
COPY --from=deps /app/packages/*/node_modules ./packages/*/node_modules
COPY . .
RUN pnpm build

# Runner stage for API
FROM base AS api-runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]

# Runner stage for Web (nginx)
FROM nginx:alpine AS web-runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]