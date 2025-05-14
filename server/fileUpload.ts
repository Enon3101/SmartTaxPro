/**
 * Secure File Upload Handler
 * 
 * SECURITY: Implements secure file handling (Req H)
 * - File type validation
 * - Size restrictions
 * - Malware scanning
 * - Secure storage with presigned URLs
 */

import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { validateInput, fileUploadSchema } from '../client/src/lib/validation';

// Define allowed file types and maximum sizes
const ALLOWED_FILE_TYPES = {
  'image': ['image/jpeg', 'image/png', 'image/gif'],
  'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'spreadsheet': ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  'text': ['text/plain', 'text/csv'],
};

const MAX_FILE_SIZE = {
  'image': 5 * 1024 * 1024, // 5MB
  'document': 10 * 1024 * 1024, // 10MB
  'spreadsheet': 10 * 1024 * 1024, // 10MB
  'text': 2 * 1024 * 1024, // 2MB
};

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // SECURITY: Generate secure random filename to prevent path traversal (Req H)
    const fileExt = path.extname(file.originalname);
    const randomName = nanoid(24); // Generate secure random name
    cb(null, `${randomName}${fileExt}`);
  }
});

// File filter to validate uploads
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Get the file type from the request or default to 'document'
  const fileType = req.body.fileType || req.query.fileType || 'document';
  
  // SECURITY: Validate file mimetype (Req H)
  if (!ALLOWED_FILE_TYPES[fileType]?.includes(file.mimetype)) {
    return cb(new Error(`File type not allowed. Allowed types for ${fileType}: ${ALLOWED_FILE_TYPES[fileType].join(', ')}`));
  }
  
  cb(null, true);
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Default 10MB max
  }
});

/**
 * Mock virus scanning functionality
 * In a real implementation, you would integrate with an antivirus service
 * SECURITY: Scan uploads for malware (Req H)
 */
export async function scanFile(filePath: string): Promise<{ clean: boolean, threats: string[] }> {
  // Simulate virus scanning with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // This is a mock implementation
  // In production, integrate with a real antivirus API
  return {
    clean: true,
    threats: []
  };
}

/**
 * Generate a presigned URL for secure file access
 * SECURITY: Presigned URLs expire in 10 minutes (Req H)
 */
export function generatePresignedUrl(filePath: string, expiresInMinutes = 10): string {
  // Get filename from path
  const filename = path.basename(filePath);
  
  // Compute expiration timestamp
  const expiresAt = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60);
  
  // Generate signature using HMAC (in production, use a proper signing mechanism)
  const data = `${filename}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', process.env.FILE_ACCESS_SECRET || 'default-secret')
    .update(data)
    .digest('hex');
  
  // Construct URL with signature and expiration
  return `/api/files/${filename}?signature=${signature}&expires=${expiresAt}`;
}

/**
 * Verify a presigned URL
 * SECURITY: Validate signatures and expiration (Req H)
 */
export function verifyPresignedUrl(filename: string, signature: string, expires: number): boolean {
  // Check if URL is expired
  if (Date.now() / 1000 > expires) {
    return false;
  }
  
  // Recompute signature to verify
  const data = `${filename}:${expires}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FILE_ACCESS_SECRET || 'default-secret')
    .update(data)
    .digest('hex');
  
  // Verify signature using constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(expectedSignature)
  );
}

/**
 * Middleware to handle file uploads with security checks
 * SECURITY: Comprehensive security checks for file uploads (Req H)
 */
export function handleFileUpload(fieldName: string, fileType: keyof typeof ALLOWED_FILE_TYPES) {
  return [
    // Set the file size limit for the specific file type
    multer({
      storage,
      fileFilter,
      limits: {
        fileSize: MAX_FILE_SIZE[fileType],
      }
    }).single(fieldName),
    
    // Additional security checks
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // SECURITY: Scan file for malware (Req H)
        const scanResult = await scanFile(req.file.path);
        
        if (!scanResult.clean) {
          // Delete the file if it contains threats
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ 
            error: 'File appears to be infected with malware', 
            threats: scanResult.threats 
          });
        }
        
        // Continue to the next middleware
        next();
      } catch (error) {
        // Delete the file if an error occurs
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        next(error);
      }
    }
  ];
}

/**
 * Middleware to serve files securely
 * SECURITY: Validates signatures before serving files (Req H)
 */
export function serveSecureFile(req: Request, res: Response) {
  const { filename } = req.params;
  const { signature, expires } = req.query;
  
  // SECURITY: Validate presigned URL (Req H)
  if (!signature || !expires || 
      typeof signature !== 'string' || 
      typeof expires !== 'string' ||
      !verifyPresignedUrl(filename, signature, parseInt(expires, 10))) {
    return res.status(403).json({ error: 'Invalid or expired file access link' });
  }
  
  // Construct safe file path, preventing path traversal
  const filePath = path.join(process.cwd(), 'uploads', path.basename(filename));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // SECURITY: Set headers to prevent caching of sensitive files (Req E)
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Send the file
  res.sendFile(filePath);
}