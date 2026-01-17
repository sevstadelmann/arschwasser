# --- Stage 1: Build ---
FROM node:22 AS builder
WORKDIR /app

# Copy the entire repository into /app
COPY . .

# DEBUG: This will show us exactly what got copied into /app
RUN ls -R /app

# Move into the frontend folder where the package.json is
WORKDIR /app/frontend

# Now run the install
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