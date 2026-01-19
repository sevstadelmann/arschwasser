# --- Stage 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# 1. Alles kopieren
COPY . .

# 2. Frontend bauen
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build
# HINWEIS: Prüfe, ob hier ein Ordner 'dist' oder 'build' entsteht! 
# Vite = dist, CRA = build. Ich gehe unten von 'dist' aus.

# --- Stage 2: Production ---
FROM node:22-alpine
WORKDIR /app

# Environment auf production setzen (wichtig für server.js Logik)
ENV NODE_ENV=production

# 3. Server-Dependencies installieren (Cache effizient nutzen)
# Wir kopieren erst nur package.json aus dem server-Ordner
COPY server/package.json ./
RUN npm install --only=production

# 4. Den Server-Code kopieren
# Wir kopieren server.js direkt ins Root von /app
COPY server/server.js ./
# Falls du weitere Server-Dateien hast (z.B. utils.js), kopiere den ganzen Ordner:
# COPY server/ ./

# 5. Das gebaute Frontend kopieren
# Wir benennen den Ordner im Container explizit 'public', damit server.js ihn findet
# ACHTUNG: Passe 'dist' an 'build' an, falls du kein Vite nutzt!
COPY --from=builder /app/frontend/dist ./public

# 6. Starten
EXPOSE 3000
# Cloud Run injectet PORT, dein Server nutzt process.env.PORT (korrekt)
CMD ["node", "server.js"]