# Use the official Node.js 16 image as base
FROM node:21.1.0-alpine

# Install yarn
RUN npm install -g yarn

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of your application code
COPY . .

# Build your NestJS application (assuming it compiles TypeScript to JavaScript)
RUN yarn build

# Expose the port your application runs on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start:prod"]