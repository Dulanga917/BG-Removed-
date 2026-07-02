import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import config from './src/config.js';
import imageRoutes from './src/routes/imageRoutes.js';

const app = express();

// ---------------------------------------------------------------------------
// CORS – allow the Vite dev server origin
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ---------------------------------------------------------------------------
// Body parsers
// ---------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Ensure upload & processed directories exist
// ---------------------------------------------------------------------------
fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
fs.mkdirSync(config.PROCESSED_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Serve uploaded & processed images as static files
// ---------------------------------------------------------------------------
app.use('/uploads', express.static(config.UPLOAD_DIR));
app.use('/processed', express.static(config.PROCESSED_DIR));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use('/api/images', imageRoutes);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  // Multer-specific errors (file too large, wrong field name, etc.)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: `File too large. Maximum size is ${config.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    });
  }

  if (err.message?.includes('Invalid file type')) {
    return res.status(415).json({ success: false, error: err.message });
  }

  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(config.PORT, () => {
  console.log(`🚀 Background Remover API running on http://localhost:${config.PORT}`);
  console.log(`📡 AI Server URL: ${config.AI_SERVER_URL}`);
});
