# Stage 1: Build the Angular app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build:production

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist/Conversational-Ai-Interviewe /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
