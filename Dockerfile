FROM node:22

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies first
RUN npm install

# Copy rest of the app (after installing to avoid cache busting)
COPY . .

EXPOSE 5000

