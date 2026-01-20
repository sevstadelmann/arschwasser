/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const WebSocket = require('ws');
const { URLSearchParams, URL } = require('url');
const rateLimit = require('express-rate-limit');

const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Ensure frontend can talk to backend
require('dotenv').config(); // To load environment variables

const app = express();
const port = process.env.PORT || 3000;
const externalApiBaseUrl = 'https://generativelanguage.googleapis.com';
const externalWsBaseUrl = 'wss://generativelanguage.googleapis.com';

app.use(cors()); // Allow requests from your React app
app.use(express.json()); // Allow JSON body parsing

// --- MULTER SETUP (Handles the image upload) ---
// We use 'memoryStorage' so the file is held in RAM (buffer) briefly to attach to email
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// --- NODEMAILER SETUP (Handles sending email) ---
// Replace these details with your actual email provider info
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or 'hotmail', 'outlook', or your hosting SMTP
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password (or App Password)
  }
});

// --- ORDER SUBMISSION ENDPOINT ---
app.post('/api/submit-order', upload.single('id_document'), async (req, res) => {
  try {
    // 1. Check if file exists
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No ID document uploaded' });
    }

    // 2. Parse the text data
    // Multer handles the file, but the rest of the data comes as a JSON string
    const orderData = JSON.parse(req.body.order_data);

    // 3. Send email to YOURSELF
    await transporter.sendMail({
      from: '"Shop System" <system@arschwasser.ch>',
      to: 'severin.stadelmann@vestryx.com', // <--- PUT YOUR EMAIL HERE
      subject: `New Order from ${orderData.shipping.firstName}`,
      html: `
        <h2>New Order Received (Invoice)</h2>
        <p><strong>Customer:</strong> ${orderData.shipping.firstName} ${orderData.shipping.lastName}</p>
        <p><strong>Address:</strong><br/>
           ${orderData.shipping.address}<br/>
           ${orderData.shipping.city}, ${orderData.shipping.zip}
        </p>
        <p><strong>Total Amount:</strong> CHF ${orderData.total.toFixed(2)}</p>
        <hr/>
        <h3>Items:</h3>
        <ul>
          ${orderData.cart.map(item => `<li>${item.quantity}x ${item.name} (CHF ${item.price})</li>`).join('')}
        </ul>
        <p><em>The user's ID is attached to this email.</em></p>
      `,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer // This attaches the file from memory directly to the email
        }
      ]
    });

    console.log('Order email sent successfully');
    res.json({ success: true });

  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Support either API key env-var variant
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

// --- PFAD LOGIK (NEU) ---
const isProduction = process.env.NODE_ENV === 'production';

// Im Docker (Production) liegt der Ordner 'public' direkt neben der server.js (siehe Dockerfile).
// Lokal (Development) liegt er im Parallelordner '../frontend/dist' (bei Vite) oder '../frontend/build' (bei CRA).
// WICHTIG: Prüfe, ob dein Build-Ordner 'dist' oder 'build' heißt und pass es hier ggf. an!
const frontendBuildPath = isProduction
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '..', 'frontend', 'dist'); 

console.log(`Running in ${isProduction ? 'Production' : 'Development'} mode`);
console.log("Serving static files from:", frontendBuildPath);

if (!apiKey) {
    console.error("Warning: GEMINI_API_KEY or API_KEY environment variable is not set! Proxy functionality will be disabled.");
} else {
    console.log("API KEY FOUND (proxy will use this)");
}

// Limit body size to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.set('trust proxy', 1);

// Rate limiter for the proxy
const proxyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}. Path: ${req.path}`);
        res.status(options.statusCode).send(options.message);
    }
});

// Apply rate limiter
app.use('/api-proxy', proxyLimiter);

// --- API PROXY LOGIC (Unverändert, nur eingerückt) ---
app.use('/api-proxy', async (req, res, next) => {
    // WebSocket Upgrade Check
    if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
        return next();
    }

    // CORS Preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Goog-Api-Key');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.sendStatus(200);
    }

    try {
        const targetPath = req.url.startsWith('/') ? req.url.substring(1) : req.url;
        const apiUrl = `${externalApiBaseUrl}/${targetPath}`;
        
        // Prepare headers
        const outgoingHeaders = {};
        for (const header in req.headers) {
            if (!['host', 'connection', 'content-length', 'transfer-encoding', 'upgrade', 'sec-websocket-key', 'sec-websocket-version', 'sec-websocket-extensions'].includes(header.toLowerCase())) {
                outgoingHeaders[header] = req.headers[header];
            }
        }
        outgoingHeaders['X-Goog-Api-Key'] = apiKey;

        // Content-Type handling
        if (req.headers['content-type'] && ['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
            outgoingHeaders['Content-Type'] = req.headers['content-type'];
        } else if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
            outgoingHeaders['Content-Type'] = 'application/json';
        }

        if (['GET', 'DELETE'].includes(req.method.toUpperCase())) {
            delete outgoingHeaders['Content-Type'];
            delete outgoingHeaders['content-type'];
        }
        if (!outgoingHeaders['accept']) outgoingHeaders['accept'] = '*/*';

        const axiosConfig = {
            method: req.method,
            url: apiUrl,
            headers: outgoingHeaders,
            responseType: 'stream',
            validateStatus: () => true,
        };

        if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
            axiosConfig.data = req.body;
        }

        const apiResponse = await axios(axiosConfig);

        // Forward headers
        for (const header in apiResponse.headers) {
            res.setHeader(header, apiResponse.headers[header]);
        }
        res.status(apiResponse.status);

        // Stream data
        apiResponse.data.pipe(res);

    } catch (error) {
        console.error('Proxy error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Proxy error', message: error.message });
        }
    }
});

// --- FRONTEND SERVING (NEU STRUKTURIERT) ---

// 1. Statische Dateien (JS, CSS, Images) ausliefern
app.use(express.static(frontendBuildPath));
// Optional: Falls du auf /public zugreifst (Legacy Support)
app.use('/public', express.static(frontendBuildPath));

// 2. Service Worker speziell behandeln (muss oft im Root liegen)
app.get('/service-worker.js', (req, res) => {
   const swPath = path.join(frontendBuildPath, 'service-worker.js');
   if (fs.existsSync(swPath)) {
       res.sendFile(swPath);
   } else {
       res.status(404).send('Service Worker not found');
   }
});

// 3. Catch-All Route für SPA (React Router Fix)
// Alles was nicht /api-proxy ist und keine statische Datei war, liefert die index.html
app.get('*', (req, res) => {
    // Sicherheitsnetz: Falls API-Calls durchrutschen, nicht HTML zurückgeben
    if (req.path.startsWith('/api-proxy')) return res.status(404).send('API endpoint not found');

    const indexPath = path.join(frontendBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("CRITICAL: index.html not found at:", indexPath);
        res.status(404).send(`Application not built correctly. Looking for index.html in ${frontendBuildPath}`);
    }
});


// --- SERVER START ---
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`HTTP/WS proxy active on /api-proxy/**`);
});


// --- WEBSOCKET PROXY (Unverändert) ---
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = requestUrl.pathname;

    if (pathname.startsWith('/api-proxy/')) {
        if (!apiKey) {
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (clientWs) => {
            const targetPathSegment = pathname.substring('/api-proxy'.length);
            const clientQuery = new URLSearchParams(requestUrl.search);
            clientQuery.set('key', apiKey);
            const targetGeminiWsUrl = `${externalWsBaseUrl}${targetPathSegment}?${clientQuery.toString()}`;

            const geminiWs = new WebSocket(targetGeminiWsUrl, {
                protocol: request.headers['sec-websocket-protocol'],
            });

            const messageQueue = [];

            geminiWs.on('open', () => {
                while (messageQueue.length > 0) {
                    const message = messageQueue.shift();
                    if (geminiWs.readyState === WebSocket.OPEN) geminiWs.send(message);
                }
            });

            geminiWs.on('message', (msg) => {
                if (clientWs.readyState === WebSocket.OPEN) clientWs.send(msg);
            });

            geminiWs.on('close', (code, reason) => {
                if (clientWs.readyState === WebSocket.OPEN) clientWs.close(code, reason.toString());
            });

            geminiWs.on('error', () => {
                if (clientWs.readyState === WebSocket.OPEN) clientWs.close(1011, 'Upstream Error');
            });

            clientWs.on('message', (msg) => {
                if (geminiWs.readyState === WebSocket.OPEN) {
                    geminiWs.send(msg);
                } else if (geminiWs.readyState === WebSocket.CONNECTING) {
                    messageQueue.push(msg);
                }
            });

            clientWs.on('close', (code, reason) => {
                if (geminiWs.readyState === WebSocket.OPEN) geminiWs.close(code, reason.toString());
            });
             clientWs.on('error', () => {
                if (geminiWs.readyState === WebSocket.OPEN) geminiWs.close(1011, 'Client Error');
            });
        });
    } else {
        socket.destroy();
    }
});