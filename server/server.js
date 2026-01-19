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

// --- SWISSID INTEGRATION: Imports ---
const session = require('express-session');
const { Issuer, generators } = require('openid-client');

const app = express();
const port = process.env.PORT || 3000;
const externalApiBaseUrl = 'https://generativelanguage.googleapis.com';
const externalWsBaseUrl = 'wss://generativelanguage.googleapis.com';

// Support either API key env-var variant
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

// --- PFAD LOGIK (Unverändert) ---
const isProduction = process.env.NODE_ENV === 'production';
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

// --- SWISSID INTEGRATION: Session Middleware ---
// Required to store the "state" and "code_verifier" during the login handshake
app.use(session({
    secret: process.env.SESSION_SECRET || 'change_me_to_a_random_string', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: isProduction, // Set to true if you are using HTTPS in production
        httpOnly: true 
    }
}));

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

// --- API PROXY LOGIC (Unverändert) ---
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
        
        const outgoingHeaders = {};
        for (const header in req.headers) {
            if (!['host', 'connection', 'content-length', 'transfer-encoding', 'upgrade', 'sec-websocket-key', 'sec-websocket-version', 'sec-websocket-extensions'].includes(header.toLowerCase())) {
                outgoingHeaders[header] = req.headers[header];
            }
        }
        outgoingHeaders['X-Goog-Api-Key'] = apiKey;

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

        for (const header in apiResponse.headers) {
            res.setHeader(header, apiResponse.headers[header]);
        }
        res.status(apiResponse.status);
        apiResponse.data.pipe(res);

    } catch (error) {
        console.error('Proxy error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Proxy error', message: error.message });
        }
    }
});


// ==================================================
// --- SWISSID INTEGRATION: Auth Routes & Logic ---
// ==================================================

let swissIdClient = null;

// Helper: Configure Frontend URL
// In Prod: Redirect to relative path '/checkout'. 
// In Dev: Redirect to where React is running (usually localhost:5173 or 3000)
const FRONTEND_URL = isProduction 
    ? '/checkout' 
    : 'http://localhost:5173/checkout'; 

// Initialize OIDC Client
async function initSwissID() {
    try {
        // Use Sandbox for testing. Change to https://login.swissid.ch for production.
        const swissIdIssuer = await Issuer.discover('https://login.sandbox.swissid.ch');
        
        swissIdClient = new swissIdIssuer.Client({
            client_id: process.env.SWISSID_CLIENT_ID,
            client_secret: process.env.SWISSID_CLIENT_SECRET,
            // Ensure this matches exactly what you registered in SwissID portal
            redirect_uris: [`http://localhost:${port}/auth/callback`], 
            response_types: ['code'],
        });
        console.log("SwissID Client initialized successfully.");
    } catch (err) {
        console.error("SwissID Initialization Error:", err.message);
    }
}
initSwissID();

// Helper: Calculate Age
function calculateAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Route 1: Trigger Login
app.get('/auth/swissid', async (req, res) => {
    if (!swissIdClient) await initSwissID(); // Ensure client is ready
    if (!swissIdClient) return res.status(500).send("Auth configuration error");

    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    
    req.session.code_verifier = code_verifier; // Save to session

    const authUrl = swissIdClient.authorizationUrl({
        scope: 'openid profile birthdate', // Critical scope
        resource: 'https://login.swissid.ch', 
        code_challenge,
        code_challenge_method: 'S256',
    });

    res.redirect(authUrl);
});

// Route 2: Callback Handler
app.get('/auth/callback', async (req, res) => {
    if (!swissIdClient) await initSwissID();

    try {
        const params = swissIdClient.callbackParams(req);
        const code_verifier = req.session.code_verifier;

        if (!code_verifier) {
            return res.redirect(`${FRONTEND_URL}?verification=error`);
        }

        const tokenSet = await swissIdClient.callback(
            `/auth/callback`, 
            params, 
            { code_verifier }
        );

        const userInfo = await swissIdClient.userinfo(tokenSet.access_token);
        const birthDate = userInfo.birthdate;

        if (!birthDate) {
            return res.redirect(`${FRONTEND_URL}?verification=failed&reason=no_date`);
        }

        if (calculateAge(birthDate) >= 18) {
            return res.redirect(`${FRONTEND_URL}?verification=success`);
        } else {
            return res.redirect(`${FRONTEND_URL}?verification=underage`);
        }

    } catch (err) {
        console.error("Auth Callback Error:", err);
        res.redirect(`${FRONTEND_URL}?verification=error`);
    }
});


// ==================================================
// --- END SWISSID INTEGRATION ---
// ==================================================


// --- FRONTEND SERVING (Unverändert) ---

// 1. Statische Dateien (JS, CSS, Images) ausliefern
app.use(express.static(frontendBuildPath));
app.use('/public', express.static(frontendBuildPath));

// 2. Service Worker
app.get('/service-worker.js', (req, res) => {
   const swPath = path.join(frontendBuildPath, 'service-worker.js');
   if (fs.existsSync(swPath)) {
       res.sendFile(swPath);
   } else {
       res.status(404).send('Service Worker not found');
   }
});

// 3. Catch-All Route für SPA
app.get('*', (req, res) => {
    // Sicherheitsnetz: API-Calls nicht HTML zurückgeben
    if (req.path.startsWith('/api-proxy') || req.path.startsWith('/auth')) {
        return res.status(404).send('Endpoint not found');
    }

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
    console.log(`Auth routes active on /auth/swissid`);
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