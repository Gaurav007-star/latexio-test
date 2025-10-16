// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const connectToMongoDB = require("./db");
// const { setupWSConnection } = require('@y/websocket-server/utils');
// const fs = require('fs');
// const https = require('https');
// const path = require("path");
// const { WebSocketServer } = require('ws');
// const openaiProxy = require("./routes/openaiProxy");

// connectToMongoDB();

// const app = express();
// const port = process.env.PORT || 5003;
// const WS_PORT = process.env.WS_PORT || 5004;

// // --- Middleware ---
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
//   credentials: true
// }));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use("/api/open-ai", openaiProxy);

// // --- Routes ---
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/project", require("./routes/project"));
// app.use("/api/latex/editor", require("./routes/editor"));

// //app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// app.use('/uploads', express.static(path.join(process.cwd(), "uploads")));
// // --- Start HTTP Server ---
// app.listen(port, () => {
//   console.log(`DataHubKGP backend running at https://api-iit-kgp-latex.demome.in:${port}`);
// });

// // --- Start Secure WebSocket Server on WS_PORT ---
// const sslOptions = {
//   cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem')),
//   key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem'))
// };

// const wsServer = https.createServer(sslOptions);

// const wss = new WebSocketServer({ server: wsServer });

// wss.on('connection', (ws, req) => {
//   console.log('Secure WebSocket client connected:', req.url);
//   // Use Yjs collaborative sync (for y-websocket clients)
//   setupWSConnection(ws, req);

//   ws.on('close', () => {
//     console.log('WebSocket client disconnected');
//   });

//   ws.on('error', (err) => {
//     console.error('WebSocket error:', err);
//   });
// });

// wsServer.listen(WS_PORT, () => {
//   console.log(`Secure WebSocket server running on wss://api-iit-kgp-latex.demome.in:${WS_PORT}`);
// });


require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectToMongoDB = require('./db');
const { setupWSConnection } = require('@y/websocket-server/utils');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { WebSocketServer } = require('ws');
const openaiProxy = require('./routes/openaiProxy');

connectToMongoDB();

const app = express();
const port = process.env.PORT || 5003;
const WS_PORT = process.env.WS_PORT || 5004;

// --- Middleware ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'],
  credentials: true
}));

// Important: keep express.json default type (application/json) — do NOT use type: '*/*'
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/project', require('./routes/project'));
app.use('/api/latex/editor', require('./routes/editor'));
app.use('/api/open-ai', openaiProxy);

// --- Start HTTP Server ---
app.listen(port, () => {
  console.log(`DataHubKGP backend running at http://localhost:${port}`);
});

// --- Start WebSocket Server ---
// Prefer secure websocket server if SSL certs exist, otherwise fallback to non-SSL server
const certPath = path.resolve(__dirname, 'ssl', 'cert.pem');
const keyPath = path.resolve(__dirname, 'ssl', 'key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  try {
    const sslOptions = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };
    const wsServer = https.createServer(sslOptions);
    const wss = new WebSocketServer({ server: wsServer });

    wss.on('connection', (ws, req) => {
      console.log('Secure WebSocket client connected:', req.url);
      setupWSConnection(ws, req);

      ws.on('close', () => console.log('WebSocket client disconnected'));
      ws.on('error', (err) => console.error('WebSocket error:', err));
    });

    wsServer.listen(WS_PORT, () => {
      console.log(`Secure WebSocket server running on wss://localhost:${WS_PORT}`);
    });
  } catch (err) {
    console.error('Failed to start secure WebSocket server, falling back to non-secure:', err.message);
    const wss = new WebSocketServer({ port: WS_PORT });
    wss.on('connection', (ws, req) => {
      console.log('WebSocket client connected (fallback):', req.url);
      setupWSConnection(ws, req);
    });
    console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
  }
} else {
  const wss = new WebSocketServer({ port: WS_PORT });
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected:', req.url);
    setupWSConnection(ws, req);
  });
  console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
}