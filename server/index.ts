import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import pinoHttp from 'pino-http';
import logger from './logger'; // Import shared logger
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite"; // Removed log import
import { setupSecurityMiddleware } from "./securityMiddleware";
// calculatorRouter and blogRouter are no longer used directly here
import path from 'path';
import fs from 'fs';

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

// Apply security middleware
setupSecurityMiddleware(app);

// Body parsers
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: false, limit: '1mb' })); // Limit form payload size

// Add pino-http logger middleware
app.use(httpLogger);

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // CLINE: Attempting to change port to 3000 and remove reusePort due to ENOTSUP error
  const port = 3000;
  server.listen({
    port,
    host: "0.0.0.0",
    // reusePort: true, // CLINE: Removed reusePort
  }, () => {
    logger.info(`Server listening on http://0.0.0.0:${port}`);
  });
})();
