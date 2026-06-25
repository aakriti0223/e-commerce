# ---------- Build stage ----------
FROM node:24.16.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# Dummy DATABASE_URL is only for Prisma generate during Docker build.
# Real DATABASE_URL will come from AWS Secrets Manager at runtime.
RUN DATABASE_URL="postgresql://user:password@localhost:5432/dummydb" npx prisma generate

RUN npm run build


# ---------- Production stage ----------
FROM node:24.16.0-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "const port = process.env.PORT || 3001; require('http').get('http://localhost:' + port + '/api/v1/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/src/main.js"]