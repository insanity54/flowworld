FROM node:22

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json .

# Copy rest of the app
COPY . .

# Copy prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Install dependencies
RUN npm install

EXPOSE 5000

CMD ["npm", "run", "start"]

