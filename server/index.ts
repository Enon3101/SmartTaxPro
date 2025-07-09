import 'dotenv/config';
// Initialize OpenTelemetry (must be first)
import './otel';

import fs from 'fs';
import path from 'path';
import compression from 'compression'; // Moved import to the top
import cors from 'cors';
import express, { type Request, Response, NextFunction } from "express";
import passport from 'passport'; // Import Passport
import pinoHttp from 'pino-http';

import logger from './logger'; // Import shared logger
import { registerRoutes } from "./routes";
import { setupSecurityMiddleware } from "./securityMiddleware";
import { setupVite, serveStatic } from "./vite"; // Removed log import
import { healthCheckHandler, simpleHealthCheck } from './healthcheck';
// calculatorRouter and blogRouter are no longer used directly here

const httpLogger = pinoHttp({ logger });

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info('Created uploads directory');
}

const app = express();

// Trust proxies for proper client IP detection (needed for rate limiting)
app.set('trust proxy', 1);

// SECURITY: Configure CORS policy
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
          'https://myeca.in',
    'https://app.myeca.in'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Apply security middleware
setupSecurityMiddleware(app);

// Body parsers
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: false, limit: '1mb' })); // Limit form payload size

// Add pino-http logger middleware
app.use(httpLogger);

// Initialize Passport
app.use(passport.initialize());

// Health check routes - these should be early in the middleware chain
app.get('/health', healthCheckHandler); // Comprehensive health check
app.get('/health/simple', simpleHealthCheck); // Simple health check for load balancers

// Add after helmet middleware
app.use(compression());

// Add a basic readiness check
app.get('/ready', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ready',
    timestamp: new Date().toISOString(),
    message: 'Server is ready to accept requests'
  });
});

// Add a basic root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'SmartTaxPro API is running',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

(async () => {
  try {
    logger.info('Starting SmartTaxPro server...');
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Node version: ${process.version}`);
    logger.info(`Platform: ${process.platform}`);
    logger.info(`Architecture: ${process.arch}`);
    
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      logger.warn('DATABASE_URL not configured - some features may not work');
    } else {
      logger.info('Database URL is configured');
    }
    
    let server;
    let routesRegistered = false;
    
    try {
      server = await registerRoutes(app);
      routesRegistered = true;
      logger.info('All routes registered successfully');
    } catch (error) {
      logger.error('Failed to register routes:', error);
      // Create a minimal server for health checks
      const { createServer } = await import('http');
      server = createServer(app);
      logger.warn('Created minimal server for health checks only');
    }

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      const status = (err as any).status || (err as any).statusCode || 500;
      
      // SECURITY: Don't expose detailed error messages in production (Req E)
      const isProduction = process.env.NODE_ENV === 'production';
      const message = isProduction && status === 500 
        ? "Internal Server Error" 
        : err.message || "Internal Server Error";
      
      // SECURITY: Don't include stack traces in response (Req E)
      const response = { message };
      
      logger.error({ status, err }, `Unhandled error: ${err.message}`);
      
      res.status(status).json(response);
      
      // Don't throw in production to prevent crashing the server
      if (!isProduction) {
        throw err;
      }
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Get port from environment variable (Railway sets PORT)
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    
    logger.info(`Attempting to start server on port ${port}...`);
    
    // Add a small delay to ensure all middleware is properly initialized
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      logger.info(`✅ Server successfully started on http://0.0.0.0:${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check available at: http://0.0.0.0:${port}/health/simple`);
      logger.info(`Ready check available at: http://0.0.0.0:${port}/ready`);
      logger.info(`Routes registered: ${routesRegistered ? 'Yes' : 'No (minimal mode)'}`);
      
      // Log memory usage
      const memUsage = process.memoryUsage();
      logger.info(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      logger.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        logger.error('Unknown server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
})();
