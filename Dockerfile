FROM node:18

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy only the necessary files to install dependencies
COPY package*.json ./

# Install dependencies in a separate layer
RUN npm ci

# Copy the rest of the files
COPY . .

# Generate prisma client
RUN npm run prisma:generate

# Build the project
RUN npm run build

# Development command
CMD ["npm", "run", "start:dev"] 
