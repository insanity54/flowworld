FROM node:22

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Use npm ci for clean install based on lockfile
RUN npm ci

# Copy prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the app
COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
