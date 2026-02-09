# Dockerfile

FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --production

# Copy the rest of the application files
COPY . .

# Build the project
RUN pnpm build

# Expose the ports
EXPOSE 5173 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "start"]