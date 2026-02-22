# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# 1. Copy all source code (Frontend + Server)
COPY . .

# 2. Frontend bauen
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build
# Frontend outputs to 'build' folder (Create React App)

# --- Stage 2: Production ---
FROM node:22-alpine
WORKDIR /app

# Set production environment variables
# Explicitly set PORT to 8080 - Cloud Run will override this
ENV NODE_ENV=production
ENV PORT=8080

# 3. Install Server-Dependencies
COPY server/package.json ./package.json
RUN npm install

# 4. Copy Server-Code
# Copy the entire server directory, including .env (which should be in server/)
COPY server/ ./

# 5. Copy Frontend-Build
# rename 'dist' to 'build' if you are not using Vite!
# If using Vite, change the output folder in vite.config.js to 'dist' and adjust this COPY command accordingly.
COPY --from=builder /app/frontend/build ./public

# 6. Start
EXPOSE 8080
CMD ["node", "server.js"]