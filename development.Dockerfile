FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lock ./
RUN rm -f bun.lock && bun install

COPY . .
RUN chown -R bun:bun /app

ENV PORT=8095 \
    NODE_ENV=development

EXPOSE 8095
CMD ["bun", "run", "dev"]
