# Use the official Node.js image
FROM node:22

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for caching dependencies)
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN corepack enable && corepack prepare --activate 

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN pnpx prisma generate

# Copy the rest of your app's code
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 5000

# Start your app
CMD ["pnpm", "run", "start"]
