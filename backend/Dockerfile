FROM node:18-alpine

# Create app directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Install dependencies first for better layer caching
# Copy only backend package manifests when context is project root
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source (only backend contents) to /app root
COPY . .

# Expose the app port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]