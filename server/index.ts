import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSecurityMiddleware } from "./securityMiddleware";
import calculatorRouter from "./calculatorRoutesFixed";
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  log('Created uploads directory');
}

const app = express();

// Trust proxies for proper client IP detection (needed for rate limiting)
app.set('trust proxy', 1);

// Apply security middleware
setupSecurityMiddleware(app);

// Body parsers
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: false, limit: '1mb' })); // Limit form payload size

// Register calculator routes directly
app.use('/api/calculators', calculatorRouter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

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
    
    log(`ERROR [${status}]: ${err.message}`);
    
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
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
