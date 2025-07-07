# Use the official Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for caching dependencies)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's code
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 5000

# Start your app
CMD ["npm", "run", "start"]
