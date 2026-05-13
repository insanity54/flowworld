FROM oven/bun:latest AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN rm -f bun.lock && bun install

COPY . .
RUN bun run build

FROM oven/bun:latest

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY pb_public ./pb_public

ENV PORT=8095 \
    NODE_ENV=production

EXPOSE 8095
CMD ["bun", "run", "./build/index.js"]
