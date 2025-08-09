# Dockerfile for Superintelligent Agent Collective
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy all source files
COPY . .

# Expose port for monitoring API
EXPOSE 3000

# Start the autonomous agents
CMD ["node", "superintelligent_agent_collective.js"]