# Use a lightweight Node.js image as the base
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the rest of the application files into the container
COPY . .

# Expose the port that the application listens on
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]