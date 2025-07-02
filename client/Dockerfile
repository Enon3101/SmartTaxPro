# ──────────────────────────────────────────────────────────
# Stage 1 – Build (uses full Node image)
# ──────────────────────────────────────────────────────────
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────
# Stage 2 – Runtime (serve static files)
# ──────────────────────────────────────────────────────────
FROM node:18-slim AS runtime
RUN npm install -g serve && useradd -m app

WORKDIR /app
COPY --from=builder /app/dist ./dist
USER app
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"] 