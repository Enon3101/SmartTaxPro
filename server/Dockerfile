# ──────────────────────────────────────────────────────────
# Stage 1 – Build
# ──────────────────────────────────────────────────────────
FROM node:18 AS builder

# Install app dependencies based on the root package.json (monorepo style)
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────
# Stage 2 – Production runtime
# ──────────────────────────────────────────────────────────
FROM node:18-slim AS runtime

# Create non-root user and group "app"
RUN addgroup --system app && adduser --system --group app app

WORKDIR /app

# Environment
ENV NODE_ENV=production

# Copy only production node_modules + built artefacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER app

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"] 