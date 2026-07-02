import AWS from 'aws-sdk';
import logger from '../utils/logger';

const hasAwsCredentials = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
const s3 = hasAwsCredentials
  ? new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'eu-west-1',
    })
  : null;

const demoStorage = new Map<string, { buffer: Buffer; mimeType: string; companyId: string }>();

export class StorageService {
  private bucket = process.env.AWS_S3_BUCKET || 'saas-pme-files';

  private isDemoMode(): boolean {
    return !hasAwsCredentials || !s3;
  }

  /**
   * Upload un fichier vers S3
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    companyId: string
  ): Promise<string> {
    try {
      if (this.isDemoMode()) {
        const key = `${companyId}/documents/${Date.now()}-${fileName}`;
        demoStorage.set(key, { buffer: fileBuffer, mimeType, companyId });
        const localPath = `/local-storage/${encodeURIComponent(key)}`;
        logger.info(`Demo mode: file stored locally at ${localPath}`);
        return localPath;
      }

      const key = `${companyId}/documents/${Date.now()}-${fileName}`;

      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'private' as const,
        Metadata: {
          companyId,
          uploadedAt: new Date().toISOString(),
        },
      };

      const result = await s3!.upload(params).promise();

      logger.info(`File uploaded to S3: ${result.Location}`);
      return result.Location;
    } catch (error) {
      logger.error('S3 upload error:', error);
      if (this.isDemoMode()) {
        return `/local-storage/${encodeURIComponent(`${companyId}/documents/${Date.now()}-${fileName}`)}`;
      }

      throw new Error('Failed to upload file');
    }
  }

  /**
   * Télécharger un fichier depuis S3
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      if (this.isDemoMode()) {
        return demoStorage.get(key)?.buffer || Buffer.from('');
      }

      const params = {
        Bucket: this.bucket,
        Key: key,
      };

      const result = await s3!.getObject(params).promise();
      return result.Body as Buffer;
    } catch (error) {
      logger.error('S3 download error:', error);
      if (this.isDemoMode()) {
        return demoStorage.get(key)?.buffer || Buffer.from('');
      }

      throw new Error('Failed to download file');
    }
  }

  /**
   * Supprimer un fichier de S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      if (this.isDemoMode()) {
        demoStorage.delete(key);
        logger.info(`Demo mode: file deleted locally: ${key}`);
        return;
      }

      const params = {
        Bucket: this.bucket,
        Key: key,
      };

      await s3!.deleteObject(params).promise();
      logger.info(`File deleted from S3: ${key}`);
    } catch (error) {
      logger.error('S3 delete error:', error);
      if (this.isDemoMode()) {
        return;
      }

      throw new Error('Failed to delete file');
    }
  }

  /**
   * Générer une URL présignée pour accès temporaire
   */
  generatePresignedUrl(key: string, expiresIn: number = 3600): string {
    try {
      if (this.isDemoMode()) {
        return `/local-storage/${encodeURIComponent(key)}`;
      }

      const params = {
        Bucket: this.bucket,
        Key: key,
        Expires: expiresIn,
      };

      return s3!.getSignedUrl('getObject', params);
    } catch (error) {
      logger.error('Presigned URL generation error:', error);
      if (this.isDemoMode()) {
        return `/local-storage/${encodeURIComponent(key)}`;
      }

      throw new Error('Failed to generate presigned URL');
    }
  }

  /**
   * Lister les fichiers d'une entreprise
   */
  async listFiles(companyId: string, prefix: string = ''): Promise<AWS.S3.ObjectList> {
    try {
      if (this.isDemoMode()) {
        return [...demoStorage.entries()]
          .filter(([key, value]) => value.companyId === companyId && key.startsWith(`${companyId}/${prefix}`))
          .map(([key, value]) => ({
            Key: key,
            Size: value.buffer.length,
            LastModified: new Date(),
            ETag: 'demo',
            StorageClass: 'STANDARD',
          })) as AWS.S3.ObjectList;
      }

      const params = {
        Bucket: this.bucket,
        Prefix: `${companyId}/${prefix}`,
      };

      const result = await s3!.listObjects(params).promise();
      return result.Contents || [];
    } catch (error) {
      logger.error('S3 list error:', error);
      if (this.isDemoMode()) {
        return [];
      }

      throw new Error('Failed to list files');
    }
  }
}

export default new StorageService();
