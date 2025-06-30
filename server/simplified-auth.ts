/**
 * Simplified authentication for testing
 */
import crypto from 'crypto';

import { Request, Response, NextFunction } from 'express';

import { storage } from './storage';

export async function verifyPassword(input: string, storedHash: string): Promise<boolean> {
  // For this simplified version, we're using a basic hash
  const inputHash = crypto
    .createHash('sha256')
    .update(input)
    .digest('hex');
  
  return inputHash === storedHash;
}

export function loginHandler(req: Request, res: Response) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Hard-coded check for our test user
  if (username === 'user' && password === 'user') {
    return res.status(200).json({
      user: {
        id: 2,
        username: 'user',
        role: 'user',
        firstName: 'Test',
        lastName: 'User'
      }
    });
  }
  
  return res.status(401).json({ message: "Invalid username or password" });
}