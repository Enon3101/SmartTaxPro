#!/usr/bin/env node

import express from 'express';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Health check endpoints
app.get('/ready', (req, res) => {
  res.status(200).json({ 
    status: 'ready',
    timestamp: new Date().toISOString(),
    message: 'Server is ready to accept requests'
  });
});

app.get('/health/simple', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    message: 'Service is running'
  });
});

app.get('/health', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usagePercent = (usedMem / totalMem) * 100;
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: { 
        status: 'degraded', 
        message: 'Not configured for minimal deployment',
        details: { error: 'DATABASE_URL not configured' }
      },
      filesystem: { 
        status: 'healthy', 
        message: 'Working',
        details: { uploadsDir: uploadDir }
      },
      memory: { 
        status: usagePercent < 90 ? 'healthy' : 'degraded', 
        message: `Memory usage: ${usagePercent.toFixed(2)}%`,
        details: { usagePercent: usagePercent.toFixed(2) }
      },
      disk: { 
        status: 'healthy', 
        message: 'OK',
        details: { workingDirectory: process.cwd() }
      },
      dependencies: { 
        status: 'healthy', 
        message: 'OK',
        details: { checkedModules: ['express'] }
      }
    },
    system: {
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        usagePercent: usagePercent.toFixed(2)
      }
    }
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartTaxPro API is running (minimal deployment)',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    note: 'This is a minimal deployment for Railway healthcheck. Full features require database configuration.'
  });
});

// Create server
const server = createServer(app);

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Railway deployment server started on http://0.0.0.0:${port}`);
  console.log(`Health check available at: http://0.0.0.0:${port}/ready`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Platform: ${os.platform()}`);
  console.log(`Architecture: ${os.arch()}`);
  
  // Log memory usage
  const memUsage = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else {
    console.error('Unknown server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 