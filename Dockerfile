# --- Stage 1: Builder ---
FROM node:22 AS builder
WORKDIR /app

# 1. Copy everything into the container
# Ensure your .gitmodules are present so the submodule step in YAML works
COPY . .

# 2. Build the Frontend
# We move into the subdirectory where your frontend package.json lives
WORKDIR /app/frontend

# Fix: Use --legacy-peer-deps to resolve the React/TypeScript version conflict
# and explicitly install 'three' which was missing in your last build
RUN npm install --legacy-peer-deps
RUN npm run build

# --- Stage 2: Final Run Image ---
FROM node:22
WORKDIR /app

# 3. Copy only the files needed for the server to run
# From the logs, your server files are in /app/server
COPY --from=builder /app/server ./server

# 4. Copy the package.json needed for the server
# Your logs showed a package.json exists inside /app/server
COPY --from=builder /app/server/package.json ./package.json

# 5. Copy the frontend build output into a public folder for the server
# React usually builds to a folder named 'build' or 'dist'
COPY --from=builder /app/frontend/build ./public

# 6. Install production dependencies for the server
RUN npm install --only=production

# 7. Start the application
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server/server.js"]