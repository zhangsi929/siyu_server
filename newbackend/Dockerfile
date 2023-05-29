# Use Node.js 16 LTS (Long Term Support) version
FROM node:19-alpine

# Create the working directory in Docker
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies in Docker
RUN npm ci

# Copy the rest of the code, but we already ignore some folder and files in .dockerignore
COPY . .

# Build the project, only ts need this
# RUN npm run build

# Expose the port that the app runs on
EXPOSE 3080

# what is this?
ENV HOST=0.0.0.0

# Start the app
CMD [ "npm", "start" ]