require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://k12-quality-inspection-system.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Express Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected system error occurred.'
  });
});

// Helper function to start server with port fallback if busy
function startServer(portToTry) {
  const normalizedPort = Number(portToTry);
  const server = app.listen(normalizedPort, () => {
    console.log(`=======================================================`);
    console.log(`  K-12 QUALITY INSPECTION & ROOT-CAUSE INTELLIGENCE API`);
    console.log(`  Running on http://localhost:${normalizedPort}`);
    console.log(`  Health Check: http://localhost:${normalizedPort}/api/health`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = normalizedPort + 1;
      console.warn(`[Port ${normalizedPort} in use. Retrying on port ${nextPort}...]`);
      startServer(nextPort);
    } else {
      console.error('[Server Error]:', err);
    }
  });
}

startServer(PORT);
