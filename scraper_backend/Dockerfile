FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies only (no Playwright browsers yet)
RUN npm ci --omit=dev || npm install --production

# Copy application code
COPY . .

# Cloud Run environment variables
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Start the autonomous agent mesh network
CMD ["node", "autonomous_agent_mesh_network.js"]