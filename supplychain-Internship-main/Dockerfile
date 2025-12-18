# Production Dockerfile for Next.js app (app directory)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production --no-audit --no-fund

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund && \
    npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /node_modules ./node_modules
# copy entrypoint and wait script
COPY ./scripts/wait-for-mongo.js ./scripts/wait-for-mongo.js
COPY ./docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh || true
EXPOSE 3000
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
