import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

/**
 * Generate a presigned URL for secure file access.
 * The URL is valid only until `expiresInMinutes` and is signed with HMAC.
 */
export function generatePresignedUrl(relativeFilePath: string, expiresInMinutes = 10): string {
  const fileAccessSecret = process.env.FILE_ACCESS_SECRET;
  if (!fileAccessSecret) {
    throw new Error('FILE_ACCESS_SECRET environment variable is required');
  }
  
  const safePath = path.normalize(relativeFilePath).replace(/^\.?(\\|\/)+/, ''); // prevent traversal
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const data = `${safePath}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', fileAccessSecret)
    .update(data)
    .digest('hex');
  return `/files/${encodeURIComponent(safePath)}?signature=${signature}&expires=${expiresAt}`;
}

export function verifyPresignedUrl(safePath: string, signature: string, expires: number): boolean {
  if (Date.now() / 1000 > expires) return false;
  
  const fileAccessSecret = process.env.FILE_ACCESS_SECRET;
  if (!fileAccessSecret) {
    return false; // Return false if secret is not configured
  }
  
  const data = `${safePath}:${expires}`;
  const expected = crypto
    .createHmac('sha256', fileAccessSecret)
    .update(data)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/**
 * Express handler that validates signature & serves the file if valid.
 * Route pattern example: `app.get('/files/:encodedPath', serveSecureFile)`
 */
export function serveSecureFile(req: Request, res: Response) {
  const encodedPath = req.params.encodedPath || req.params[0] || '';
  const safePath = decodeURIComponent(encodedPath);
  const { signature, expires } = req.query;

  if (
    !signature ||
    !expires ||
    typeof signature !== 'string' ||
    typeof expires !== 'string' ||
    !verifyPresignedUrl(safePath, signature, parseInt(expires, 10))
  ) {
    return res.status(403).json({ error: 'Invalid or expired file access link' });
  }

  const filePath = path.join(process.cwd(), 'uploads', safePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.sendFile(filePath);
} 