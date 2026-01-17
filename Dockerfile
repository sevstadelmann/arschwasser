# --- Stage 1: Build ---
FROM node:22 AS builder
WORKDIR /app

# 1. Copy everything (including package.json and the frontend folder)
COPY . .

# 2. Install and Build from the ROOT
# (This assumes package.json is in the root)
RUN npm install
RUN npm run build

# --- Stage 2: Run ---
FROM node:22
WORKDIR /app

# 3. Copy server files
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json .

# 4. Copy the build output
# Most frameworks output to 'dist' or 'build' in the root
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "server/index.js"]