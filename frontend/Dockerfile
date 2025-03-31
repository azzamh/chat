# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manager configs
COPY package.json yarn.lock* ./

# Copy the rest of the application
COPY . .

# Install dependencies
RUN corepack enable && \
    yarn install --immutable


# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built application from build stage
COPY --from=build /app/.output /app/.output
COPY --from=build /app/.nuxt /app/.nuxt
COPY --from=build /app/package.json /app/

# Expose the port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Start command
CMD ["node", ".output/server/index.mjs"]
