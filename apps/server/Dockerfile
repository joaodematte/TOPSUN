FROM oven/bun:1.3 AS base
WORKDIR /app

# Stage 1: prune monorepo to server + its deps (shared, config)
FROM base AS prepare

COPY . .
RUN bunx turbo@^2.9.16 prune server --docker

# Stage 2: install deps (cached layer — only invalidates when lockfile/deps change)
FROM base AS builder

COPY --from=prepare /app/out/json/ .
RUN bun install --frozen-lockfile

COPY --from=prepare /app/out/full/ .
RUN bunx turbo run build --filter=server

# Stage 3: slim runtime with production deps + built output
FROM oven/bun:1.3-slim AS runtime
WORKDIR /app/apps/server

ENV NODE_ENV=production
ENV CHROME_PATH=/usr/bin/chromium
ENV AUTOMATION_HEADLESS=true
ENV AUTOMATION_OUTPUT_DIR=/app/automation-runs
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /app/automation-runs

COPY --from=prepare /app/out/json/ /app/

RUN cd /app && bun install --frozen-lockfile --production
COPY --from=builder /app/apps/server/dist ./dist

EXPOSE 3001

CMD ["bun", "run", "start"]