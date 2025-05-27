# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the rest of the project (libs + apps)
COPY . .

# Set working directory to app dist
WORKDIR /app/dist/apps/user-service

# Run the app
CMD ["nest", "start", "user-service"]