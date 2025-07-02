import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { IStorageProvider, StorageUploadRequest, StorageUploadResult, FileCategory } from '../../lib/types/file-management';
import { nanoid } from 'nanoid';

export interface S3ProviderOptions {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  cdnUrl?: string; // CloudFront domain or public endpoint prefix
}

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucket: string;
  private cdnUrl?: string;

  constructor(options?: Partial<S3ProviderOptions>) {
    const cfg: S3ProviderOptions = {
      region: options?.region || process.env.AWS_REGION || 'us-east-1',
      bucket: options?.bucket || process.env.AWS_S3_BUCKET || '',
      accessKeyId: options?.accessKeyId || process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: options?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || '',
      endpoint: options?.endpoint || process.env.AWS_S3_ENDPOINT,
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
      cdnUrl: options?.cdnUrl || process.env.AWS_S3_CDN_URL,
    } as S3ProviderOptions;

    if (!cfg.bucket) {
      throw new Error('S3 bucket name is required (env AWS_S3_BUCKET)');
    }

    this.bucket = cfg.bucket;
    this.cdnUrl = cfg.cdnUrl;

    this.client = new S3Client({
      region: cfg.region,
      endpoint: cfg.endpoint,
      forcePathStyle: cfg.forcePathStyle,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    });
  }

  private buildKey(fileName: string, category: FileCategory): string {
    const datePrefix = new Date().toISOString().split('T')[0]; // e.g., 2024-05-30
    return `${category}/${datePrefix}/${nanoid(8)}-${fileName}`;
  }

  async upload(request: StorageUploadRequest): Promise<StorageUploadResult> {
    const key = this.buildKey(request.fileName, request.category);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: request.file,
        ContentType: request.contentType,
      })
    );

    return {
      path: key,
      url: this.getUrl(key),
      cdnUrl: this.getCdnUrl(key),
    };
  }

  async download(filePath: string): Promise<Buffer> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: filePath });
    const response = await this.client.send(cmd);

    // response.Body is a stream in Node
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
  }

  async delete(filePath: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: filePath })
    );
  }

  getUrl(filePath: string): string {
    // Basic object URL; use CDN if configured, else public S3 HTTP URL
    return `https://${this.bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${filePath}`;
  }

  getCdnUrl(filePath: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl.replace(/\/$/, '')}/${filePath}`;
    }
    return this.getUrl(filePath);
  }
} 