# Use the official Node.js 22 image as base
FROM node:22.9-alpine

RUN apk add postgresql && apk add postgresql-client && apk upgrade

RUN apk add bash

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

RUN npm i -g @nestjs/cli

# Install dependencies using yarn
RUN yarn install --ignore-engines --production

# Copy the rest of your application code
COPY . .

#COPY wait-for-it.sh /usr/local/bin/wait-for-it
#RUN chmod +x /usr/local/bin/wait-for-it

# Build your NestJS application (assuming it compiles TypeScript to JavaScript)
RUN yarn build

# Run migrations
#CMD ["wait-for-it", "imgazilla-postgres:5432", "--", "yarn", "migration:run"]

# Expose the port your application runs on
EXPOSE 3000

CMD [ "node", "dist/main.js" ]