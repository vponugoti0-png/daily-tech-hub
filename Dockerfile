# Aurora / Daily Tech Hub — Railway/Fly (Node + better-sqlite3 + volume at /data)
FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Railway injects matching service vars as build-args when ARG is declared
ARG AUTH_SECRET
ARG AUTH_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=$AUTH_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/data

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/lesson-redirects.json ./lesson-redirects.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Drop build toolchain in final image weight? keep g++ already in base for native rebuilds if needed.
RUN mkdir -p /data && chown -R node:node /app /data
USER node

EXPOSE 3000
CMD ["sh", "-c", "npm run start -- -H 0.0.0.0 -p ${PORT:-3000}"]
