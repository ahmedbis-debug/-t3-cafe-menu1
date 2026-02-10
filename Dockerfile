# Dockerfile

# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY pnpm-lock.yaml .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy rest of the application code
COPY . .

# Build the application
RUN pnpm build


# Stage 2: Run
FROM node:20-alpine AS runtime

# Set working directory
WORKDIR /app

# Copy only production dependencies and dist folder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Install production dependencies
RUN pnpm install --prod

# Set environment variable
ENV NODE_ENV=production

# Expose ports
EXPOSE 3000
EXPOSE 5173

# Start the application
CMD [ "node", "dist/index.js" ]