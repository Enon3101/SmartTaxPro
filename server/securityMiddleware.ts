/**
 * Security Middleware
 * 
 * SECURITY: Implements security headers and protections (Req E, L)
 * - Content Security Policy (CSP)
 * - HTTP Strict Transport Security (HSTS)
 * - Other security headers
 * - Rate limiting
 * - Request validation
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * Apply security headers to all responses
 * SECURITY: Implements secure headers (Req E)
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Set security headers manually if not using helmet
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (CSP) - customize based on your application needs
  // SECURITY: Prevents XSS and other injection attacks (Req E)
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.openrouter.ai; " +
    "font-src 'self' https:; " +
    "object-src 'none'; " +
    "media-src 'self'; " +
    "frame-src 'self';" +
    "base-uri 'self';" +
    "form-action 'self';"
  );
  
  // HTTP Strict Transport Security (HSTS)
  // SECURITY: Forces HTTPS connections (Req E)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  next();
}

/**
 * Rate limiting middleware to prevent abuse
 * SECURITY: Implements rate limiting to prevent abuse (Req L)
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    error: 'Too many requests, please try again later.',
    code: 429
  }
});

/**
 * More aggressive rate limiting for authentication endpoints
 * SECURITY: Prevents brute force attacks (Req B, L)
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Skip if request was successful
  message: { 
    error: 'Too many login attempts, please try again later.',
    code: 429
  }
});

/**
 * Configure Helmet middleware with appropriate settings
 * SECURITY: Implements multiple security headers at once (Req E)
 */
export function configureHelmet() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://replit.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openrouter.ai"],
        fontSrc: ["'self'", "https:", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: true, // Keep this, might need { policy: "credentialless" } if COEP issues persist with iframes
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  });
}

/**
 * Validate content type for API requests
 * SECURITY: Prevents content type attacks (Req A)
 */
export function validateContentType(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers['content-type'];
  
  // Skip for GET and HEAD requests which don't typically have a body
  if (['GET', 'HEAD'].includes(req.method)) {
    return next();
  }
  
  // If there's a body, ensure content type is set and is application/json
  if (contentType) {
    if (!contentType.includes('application/json') && Object.keys(req.body || {}).length > 0) {
      return res.status(415).json({ 
        error: 'Unsupported Media Type. Content-Type must be application/json.'
      });
    }
  }
  
  next();
}

/**
 * Setup all security middleware
 * SECURITY: Comprehensive security middleware setup (Req A, E, L)
 */
export function setupSecurityMiddleware(app: any) {
  // Apply helmet for security headers
  app.use(configureHelmet());
  
  // Apply custom security headers as a fallback // CLINE: Removed redundant securityHeaders call
  // app.use(securityHeaders); 
  
  // Apply general rate limiting
  app.use('/api/', apiRateLimiter);
  
  // Apply stricter rate limiting for auth endpoints
  app.use('/api/auth/', authRateLimiter);
  app.use('/api/login', authRateLimiter);
  app.use('/api/verify-otp', authRateLimiter);
  
  // Validate content type for API requests
  app.use('/api/', validateContentType);
  
  console.log('Security middleware configured successfully');
}
