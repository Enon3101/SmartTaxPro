import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// SECURITY: Configure database connection with enhanced security (Req G)
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Connection timeout after 5 seconds
  max: 20, // Maximum 20 clients in the pool
});

// Log database connection errors for monitoring
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Create drizzle ORM instance
export const db = drizzle({ client: pool, schema });

// SECURITY: Function to sanitize SQL query inputs (Req G)
export function sanitizeSqlInput(input: string): string {
  // Remove any SQL injection attempts
  return input.replace(/['";\\]/g, '');
}