import { eq, lt, and, or } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

import { files } from '../../shared/schema';
import { fileAccessLogs } from '../../shared/schema';
import { db as rawDb } from '../db';
import { S3StorageProvider } from '../storageProviders/S3StorageProvider';

const db = rawDb as NonNullable<typeof rawDb>;

async function purgeExpiredFiles() {
  const now = new Date();
  // Select expired or already soft deleted records older than 7 days
  const expired = await db
    .select()
    .from(files)
    .where(
      or(
        lt(files.expiresAt, now),
        and(eq(files.isDeleted, true), lt(files.deletedAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)))
      )
    );

  if (!expired.length) return;

  console.log(`Purging ${expired.length} files (expired or previously deleted)…`);

  for (const f of expired) {
    try {
      if (f.storageProvider === 'LOCAL') {
        const absPath = path.join(process.cwd(), 'uploads', f.filePath);
        await fs.unlink(absPath).catch(() => undefined);
      } else if (f.storageProvider === 'AWS_S3') {
        const s3 = new S3StorageProvider();
        await s3.delete(f.filePath);
      }

      // Hard-delete record
      await db.delete(files).where(eq(files.id, f.id));

      // Audit log
      await db.insert(fileAccessLogs).values({
        fileId: f.id,
        userId: null,
        accessType: 'delete',
        success: true,
        accessedAt: new Date(),
      });
    } catch (err) {
      console.error('Failed purging file', f.id, err);
    }
  }
}

async function purgeOrphans() {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const entries = await fs.readdir(uploadDir);
  const dbFiles = await db.select({ storedName: files.storedName }).from(files);
  const dbSet = new Set(dbFiles.map(f => f.storedName));
  const orphans: string[] = [];
  for (const entry of entries) {
    const entryPath = path.join(uploadDir, entry);
    const stat = await fs.stat(entryPath);
    if (stat.isDirectory()) continue;
    if (!dbSet.has(entry)) {
      orphans.push(entry);
    }
  }
  for (const file of orphans) {
    try {
      await fs.unlink(path.join(uploadDir, file));
      console.log('Removed orphan', file);
    } catch {}
  }
}

(async () => {
  await purgeExpiredFiles();
  await purgeOrphans();
  console.log('Cleanup job completed');
  process.exit(0);
})(); 