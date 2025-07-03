# SmartTaxPro Security Audit - Patch Recommendations

**Audit Date:** January 3, 2025  
**Purpose:** Actionable code fixes for identified security vulnerabilities  

---

## Critical Fixes (Immediate Implementation Required)

### C-001: Fix Authentication Bypass in File Operations

**File:** `server/fileManagementRoutes.ts`

**Current Code (Vulnerable):**
```typescript
// Lines 86-95 - Missing authentication middleware
router.post('/upload', uploadLimiter, upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req); // This throws error but route still processes
    // ... rest of handler
```

**Fixed Code:**
```typescript
import passport from 'passport';
import { AuthenticatedRequest } from '../auth';

// Add authentication middleware to ALL file routes
router.use(passport.authenticate('jwt', { session: false }));

// Updated upload handler with proper typing
router.post('/upload', uploadLimiter, upload.single('file'), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const userId = req.user.id;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }
    // ... rest of handler
```

**Additional Changes Required:**
```typescript
// Update getUserId function to be type-safe
const getUserId = (req: AuthenticatedRequest): number => {
  if (!req.user || !req.user.id) {
    throw new Error('User not authenticated');
  }
  return req.user.id;
};

// Apply to all routes in the file
router.get('/:fileId/download', downloadLimiter, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Handler implementation
}));

router.get('/search', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Handler implementation  
}));
```

---

### C-002: Remove SQL Injection Vector

**File:** `server/db.ts`

**Current Code (Vulnerable):**
```typescript
// Lines 33-36 - Dangerous manual sanitization
export function sanitizeSqlInput(input: string): string {
  // Remove any SQL injection attempts
  return input.replace(/['";\\]/g, '');
}
```

**Fixed Code:**
```typescript
// REMOVE the sanitizeSqlInput function entirely
// Drizzle ORM provides built-in parameterized queries

// Example of proper Drizzle usage (no manual sanitization needed):
export async function searchFiles(searchTerm: string, userId: number) {
  if (!db) throw new Error('Database not initialized');
  
  // Drizzle automatically parameterizes this query
  return await db.select()
    .from(files)
    .where(
      and(
        eq(files.uploadedBy, userId),
        or(
          ilike(files.originalName, `%${searchTerm}%`),
          ilike(files.metadata, `%${searchTerm}%`)
        )
      )
    );
}
```

**Update all usage locations:**
```typescript
// Find and replace any usage of sanitizeSqlInput with proper Drizzle queries
// Example in routes.ts:
// OLD: const cleanInput = sanitizeSqlInput(req.query.searchTerm);
// NEW: Just use req.query.searchTerm directly in Drizzle queries
```

---

### C-003: Implement Proper File Type Validation

**File:** `server/fileManagementRoutes.ts`

**Current Code (Vulnerable):**
```typescript
// Lines 25-45 - Only MIME type validation
fileFilter: (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    // ... other MIME types
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
}
```

**Fixed Code:**
```typescript
import { createHash } from 'crypto';

// Magic number signatures for file types
const FILE_SIGNATURES = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04],
  // Add more signatures as needed
};

// Enhanced file validation function
function validateFileContent(buffer: Buffer, declaredMimeType: string): boolean {
  const signature = FILE_SIGNATURES[declaredMimeType];
  if (!signature) return false;
  
  // Check magic number
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false;
    }
  }
  
  // Additional checks for executables
  const executableSignatures = [
    [0x4D, 0x5A], // PE executable (MZ)
    [0x7F, 0x45, 0x4C, 0x46], // ELF executable
    [0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E], // Unix archive
  ];
  
  for (const execSig of executableSignatures) {
    let match = true;
    for (let i = 0; i < execSig.length; i++) {
      if (buffer[i] !== execSig[i]) {
        match = false;
        break;
      }
    }
    if (match) return false; // Reject executables
  }
  
  return true;
}

// Updated multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // Reduced to 50MB
    files: 3 // Reduced to 3 files max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain',
      'text/csv'
    ];
    
    // MIME type check
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error(`File type ${file.mimetype} not allowed`));
    }
    
    cb(null, true);
  }
});

// Add content validation in upload handler
router.post('/upload', uploadLimiter, upload.single('file'), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }
    
    // Validate file content matches declared type
    if (!validateFileContent(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        error: 'File content does not match declared type or contains suspicious content' 
      });
    }
    
    // Optional: Virus scanning integration
    // await scanForViruses(req.file.buffer);
    
    // Continue with upload...
  } catch (error) {
    // Handle errors
  }
}));
```

---

## High Priority Fixes

### H-001: Strengthen JWT Secret Validation

**File:** `server/auth.ts`

**Current Code:**
```typescript
// Lines 38-42 - Basic existence check
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security. Generate one with: openssl rand -hex 64');
}
```

**Fixed Code:**
```typescript
import { randomBytes } from 'crypto';

function validateJWTSecret(secret: string): void {
  // Minimum length check
  if (secret.length < 64) {
    throw new Error('JWT_SECRET must be at least 64 characters long for security');
  }
  
  // Entropy check - ensure it's not a simple string
  const uniqueChars = new Set(secret.split('')).size;
  if (uniqueChars < 16) {
    throw new Error('JWT_SECRET has insufficient entropy. Use a cryptographically secure random string');
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /^(.)\1+$/, // Repeated characters
    /^(password|secret|key)/i, // Common words
    /^[a-zA-Z0-9]{1,32}$/, // Simple alphanumeric
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(secret)) {
      throw new Error('JWT_SECRET appears to be weak. Use: openssl rand -hex 64');
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Generate with: openssl rand -hex 64');
}

// Validate the secret strength
validateJWTSecret(JWT_SECRET);
const JWT_SECRET_VALIDATED: string = JWT_SECRET;

// Also add secret rotation capability
export function rotateJWTSecret(): string {
  const newSecret = randomBytes(64).toString('hex');
  console.warn('JWT secret rotation required. New secret generated.');
  return newSecret;
}
```

---

### H-002: Implement Token Blacklisting

**File:** `server/auth.ts` (additions)

**New Implementation:**
```typescript
import Redis from 'ioredis';

// Redis client for token blacklisting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Token blacklist management
export class TokenBlacklist {
  private static async addToBlacklist(token: string, expiryTime: number): Promise<void> {
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = expiryTime - currentTime;
    
    if (ttl > 0) {
      await redis.setex(`blacklist:${token}`, ttl, 'revoked');
    }
  }
  
  static async revokeToken(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_VALIDATED) as any;
      await this.addToBlacklist(token, decoded.exp);
      console.log(`Token revoked for user ${decoded.sub}`);
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  }
  
  static async isTokenRevoked(token: string): Promise<boolean> {
    try {
      const result = await redis.get(`blacklist:${token}`);
      return result === 'revoked';
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return false; // Fail open for availability
    }
  }
  
  static async revokeAllUserTokens(userId: string): Promise<void> {
    // Add user to global revocation list with timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    await redis.set(`user_revoke:${userId}`, timestamp);
  }
}

// Enhanced token verification
export function verifyTokenWithBlacklist(token: string): AppJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_VALIDATED) as AppJwtPayload;
    
    // Check if token is blacklisted (async check in middleware)
    return decoded;
  } catch (error) {
    return null;
  }
}

// Updated logout function
export async function logoutUser(token: string): Promise<void> {
  await TokenBlacklist.revokeToken(token);
  // Remove from localStorage handled client-side
}
```

**File:** `server/routes.ts` (update logout endpoint)

```typescript
authRouter.post("/logout", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await logoutUser(token);
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});
```

---

### H-003: Add Resource Ownership Verification

**File:** `server/fileManagementRoutes.ts`

**Add ownership verification middleware:**
```typescript
// Ownership verification middleware
const verifyFileOwnership = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { fileId } = req.params;
    const userId = req.user!.id;
    
    // Check if user owns the file or has permission
    const file = await db.select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1);
    
    if (!file.length) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    const fileRecord = file[0];
    
    // Check ownership or permissions
    if (fileRecord.uploadedBy !== userId) {
      // Check if user has explicit permission
      const permission = await db.select()
        .from(filePermissions)
        .where(
          and(
            eq(filePermissions.fileId, fileId),
            eq(filePermissions.userId, userId)
          )
        )
        .limit(1);
      
      if (!permission.length) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
    }
    
    // Add file info to request for use in handler
    (req as any).fileRecord = fileRecord;
    next();
  } catch (error) {
    console.error('Ownership verification error:', error);
    res.status(500).json({ success: false, error: 'Access verification failed' });
  }
});

// Apply to file access routes
router.get('/:fileId/download', downloadLimiter, verifyFileOwnership, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Implementation
}));

router.get('/:fileId/preview', downloadLimiter, verifyFileOwnership, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Implementation
}));
```

---

### H-004: Implement Data Encryption

**File:** `server/encryption.ts` (new file)

```typescript
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;
  
  private static async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return (await scryptAsync(password, salt, DataEncryption.KEY_LENGTH)) as Buffer;
  }
  
  static async encrypt(plaintext: string, masterKey: string): Promise<string> {
    try {
      const salt = randomBytes(16);
      const iv = randomBytes(DataEncryption.IV_LENGTH);
      const key = await DataEncryption.deriveKey(masterKey, salt);
      
      const cipher = createCipheriv(DataEncryption.ALGORITHM, key, iv);
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Combine salt + iv + tag + encrypted data
      const combined = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]);
      return combined.toString('base64');
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }
  
  static async decrypt(encryptedData: string, masterKey: string): Promise<string> {
    try {
      const combined = Buffer.from(encryptedData, 'base64');
      
      const salt = combined.subarray(0, 16);
      const iv = combined.subarray(16, 16 + DataEncryption.IV_LENGTH);
      const tag = combined.subarray(16 + DataEncryption.IV_LENGTH, 16 + DataEncryption.IV_LENGTH + DataEncryption.TAG_LENGTH);
      const encrypted = combined.subarray(16 + DataEncryption.IV_LENGTH + DataEncryption.TAG_LENGTH);
      
      const key = await DataEncryption.deriveKey(masterKey, salt);
      
      const decipher = createDecipheriv(DataEncryption.ALGORITHM, key, iv);
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }
}

// PII field encryption helpers
export class PIIEncryption {
  private static readonly MASTER_KEY = process.env.ENCRYPTION_KEY || '';
  
  static async encryptPII(data: any): Promise<any> {
    if (!this.MASTER_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable required');
    }
    
    const sensitiveFields = ['pan', 'aadhaar', 'phone', 'email', 'fullName'];
    const encrypted = { ...data };
    
    for (const field of sensitiveFields) {
      if (encrypted[field]) {
        encrypted[field] = await DataEncryption.encrypt(encrypted[field], this.MASTER_KEY);
      }
    }
    
    return encrypted;
  }
  
  static async decryptPII(data: any): Promise<any> {
    if (!this.MASTER_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable required');
    }
    
    const sensitiveFields = ['pan', 'aadhaar', 'phone', 'email', 'fullName'];
    const decrypted = { ...data };
    
    for (const field of sensitiveFields) {
      if (decrypted[field]) {
        try {
          decrypted[field] = await DataEncryption.decrypt(decrypted[field], this.MASTER_KEY);
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
        }
      }
    }
    
    return decrypted;
  }
}
```

**File:** `server/storage.ts` (update to use encryption)

```typescript
import { PIIEncryption } from './encryption';

// Update createTaxForm method
export async function createTaxForm(data: InsertTaxForm) {
  if (!db) throw new Error('Database not initialized');
  
  // Encrypt sensitive personal info before storing
  if (data.personalInfo) {
    data.personalInfo = await PIIEncryption.encryptPII(data.personalInfo);
  }
  
  const [taxForm] = await db.insert(taxForms).values(data).returning();
  return taxForm;
}

// Update getTaxFormById to decrypt
export async function getTaxFormById(id: string) {
  if (!db) throw new Error('Database not initialized');
  
  const [taxForm] = await db.select().from(taxForms).where(eq(taxForms.id, id));
  
  if (taxForm && taxForm.personalInfo) {
    taxForm.personalInfo = await PIIEncryption.decryptPII(taxForm.personalInfo);
  }
  
  return taxForm;
}
```

---

### H-006: Strengthen Content Security Policy

**File:** `server/securityMiddleware.ts`

**Current Code:**
```typescript
// Lines 200-220 - Allows unsafe-inline
styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
```

**Fixed Code:**
```typescript
// Generate nonce for inline styles
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

// Enhanced CSP configuration
function configureHelmet() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'", 
          "https://fonts.googleapis.com",
          // Remove 'unsafe-inline' and use nonce-based approach
          (req, res) => `'nonce-${res.locals.nonce}'`
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: [
          "'self'",
          // Use nonce for scripts instead of unsafe-inline
          (req, res) => `'nonce-${res.locals.nonce}'`,
          "https://apis.google.com", // For Google OAuth
        ],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://api.smarttaxpro.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  });
}

// Middleware to add nonce to responses
export function addSecurityNonce(req: Request, res: Response, next: NextFunction) {
  res.locals.nonce = generateNonce();
  next();
}

// Update setup function
export function setupSecurityMiddleware(app: import("express").Express) {
  // Add nonce middleware first
  app.use(addSecurityNonce);
  
  // Performance monitoring
  app.use(performanceMonitoring);
  
  // Security headers with nonce support
  app.use(configureHelmet());
  
  // ... rest of middleware
}
```

---

## Environment Configuration

**File:** `.env.example` (update)

```bash
# Add new required environment variables
ENCRYPTION_KEY=CHANGE_THIS_TO_SECURE_ENCRYPTION_KEY_GENERATED_WITH_OPENSSL_RAND_HEX_64
REDIS_URL=redis://localhost:6379
JWT_SECRET=CHANGE_THIS_TO_SECURE_JWT_SECRET_GENERATED_WITH_OPENSSL_RAND_HEX_64

# Security monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SECURITY_ALERTS_EMAIL=security@smarttaxpro.com

# File upload security
MAX_FILE_SIZE=52428800  # 50MB in bytes
VIRUS_SCAN_ENABLED=true
CLAMAV_HOST=localhost
CLAMAV_PORT=3310
```

---

## Database Migration for Security

**File:** `migrations/add_security_tables.sql` (new)

```sql
-- Add encryption metadata
ALTER TABLE tax_forms ADD COLUMN encryption_version INTEGER DEFAULT 1;
ALTER TABLE tax_forms ADD COLUMN encrypted_at TIMESTAMP;

-- Add security audit log
CREATE TABLE security_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    risk_score INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX security_audit_log_user_id_idx ON security_audit_log(user_id);
CREATE INDEX security_audit_log_event_type_idx ON security_audit_log(event_type);
CREATE INDEX security_audit_log_created_at_idx ON security_audit_log(created_at);
CREATE INDEX security_audit_log_risk_score_idx ON security_audit_log(risk_score);

-- Add token blacklist table (if not using Redis)
CREATE TABLE token_blacklist (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason VARCHAR(100)
);

CREATE INDEX token_blacklist_token_hash_idx ON token_blacklist(token_hash);
CREATE INDEX token_blacklist_expires_at_idx ON token_blacklist(expires_at);
```

---

## Implementation Checklist

### Phase 1: Critical (Day 1-2)
- [ ] Apply authentication middleware to file routes (C-001)
- [ ] Remove sanitizeSqlInput function and verify Drizzle usage (C-002)
- [ ] Implement file content validation (C-003)
- [ ] Update JWT secret validation (H-001)
- [ ] Test all changes thoroughly

### Phase 2: High Priority (Week 1)
- [ ] Implement Redis-based token blacklisting (H-002)
- [ ] Add resource ownership verification (H-003)
- [ ] Deploy data encryption for PII fields (H-004)
- [ ] Strengthen CSP with nonces (H-006)
- [ ] Update environment variables

### Phase 3: Testing & Validation
- [ ] Run security test scripts to verify fixes
- [ ] Perform penetration testing
- [ ] Update documentation
- [ ] Train development team on secure coding practices

**Estimated Total Implementation Time:** 87.5 hours across 4 weeks

**Priority Order:** Critical → High → Medium → Low severity findings