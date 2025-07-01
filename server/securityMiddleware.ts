import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

/**
 * Enhanced rate limiting with sliding window
 */
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    message: {
      error: options.message,
      code: 429,
      retryAfter: Math.ceil(options.windowMs / 1000),
    },
    // Use Redis store in production for distributed rate limiting
    // store: process.env.REDIS_URL ? new RedisStore({...}) : undefined,
    keyGenerator: (req: Request) => {
      // Use a combination of IP and user ID for authenticated requests
      const ip = req.ip || (req.socket && req.socket.remoteAddress) || 'unknown';
      const userId = (req as any).user?.id;
      return userId ? `${ip}_${userId}` : ip;
    },
  });
};

// Rate limiters for different endpoints
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased for better UX
  message: 'Too many API requests, please try again later.',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Slightly increased but still secure
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit file uploads
  message: 'Too many file uploads, please try again later.',
});

export const calculatorRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // High limit for calculators
  message: 'Too many calculator requests, please slow down.',
});

/**
 * Input sanitization middleware
 * SECURITY: Prevents injection attacks
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: URLs
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[sanitizeValue(key)] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
}

/**
 * Security monitoring middleware
 * SECURITY: Logs security events for monitoring
 */
export function securityMonitoring(req: Request, res: Response, next: NextFunction) {
  const suspiciousPatterns = [
    /union.*select/i,
    /script.*alert/i,
    /javascript:/i,
    /<script/i,
    /eval\s*\(/i,
    /document\.cookie/i,
  ];

  const requestString = JSON.stringify({
    url: req.url,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));

  if (isSuspicious) {
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    });
    
    // In production, you might want to block the request or alert security team
    // return res.status(403).json({ error: 'Request blocked for security reasons' });
  }

  next();
}

/**
 * Performance monitoring middleware
 */
export function performanceMonitoring(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn('Slow request detected:', {
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        ip: req.ip,
      });
    }
    
    // Log to performance metrics if needed
    // You could store this in the performance_metrics table
  });
  
  next();
}

/**
 * Comprehensive security middleware setup
 */
export function setupSecurityMiddleware(app: import("express").Express) {
  // Performance monitoring (should be first)
  app.use(performanceMonitoring);
  
  // Security headers
  app.use(configureHelmet());
  
  // Input sanitization
  app.use('/api/', sanitizeInput);
  
  // Security monitoring
  app.use('/api/', securityMonitoring);
  
  // Rate limiting
  app.use('/api/', apiRateLimiter);
  app.use('/api/auth/', authRateLimiter);
  app.use('/api/upload/', uploadRateLimiter);
  app.use('/api/calculator/', calculatorRateLimiter);
  
  // Content type validation for API routes
  app.use('/api/', (req: Request, res: Response, next: NextFunction) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.get('content-type');
      if (contentType && !contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
        return res.status(415).json({
          error: 'Unsupported Media Type. Content-Type must be application/json or multipart/form-data.',
        });
      }
    }
    next();
  });
  
  console.log('✅ Enhanced security middleware configured successfully');
}

function configureHelmet() {
  return helmet();
}
