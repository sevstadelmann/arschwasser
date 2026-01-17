# --- Builder Stage ---
FROM node:22 AS builder
WORKDIR /app

# Copy everything
COPY . .

# Build the frontend (No 'if' statement)
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# --- Final Stage ---
FROM node:22
WORKDIR /app

# Copy the server files
COPY --from=builder /app/server ./server

# Copy the dist folder from the frontend subfolder
COPY --from=builder /app/frontend/dist ./dist

EXPOSE 8080
CMD ["node", "server/index.js"]