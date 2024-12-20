# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY . .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]