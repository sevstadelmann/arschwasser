# --- Builder Stage ---
FROM node:22 AS builder
WORKDIR /app

# Copy everything
COPY . .

# Build the frontend (No 'if' statement)
WORKDIR /app/frontend
RUN npm install
RUN npm run build

<<<<<<< HEAD
# --- Final Stage ---
=======
# Install dependencies and build the frontend
WORKDIR /app/frontend
RUN mkdir dist
RUN bash -c 'if [ -f package.json ]; then npm install && npm run build; fi'


# Stage 2: Build the final server image
>>>>>>> b0cc4f25010e2267091d948070f0a3b5285ba48d
FROM node:22
WORKDIR /app

<<<<<<< HEAD
# Copy the server files
COPY --from=builder /app/server ./server
=======
#Copy server files
COPY --from=builder /app/server .
# Copy built frontend assets from the builder stage
COPY --from=builder /app/frontend/dist ./dist
>>>>>>> b0cc4f25010e2267091d948070f0a3b5285ba48d

# Copy the dist folder from the frontend subfolder
COPY --from=builder /app/frontend/dist ./dist

EXPOSE 8080
CMD ["node", "server/index.js"]