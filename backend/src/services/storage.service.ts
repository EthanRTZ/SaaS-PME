import logger from '../utils/logger';

const demoStorage = new Map<string, { buffer: Buffer; mimeType: string; companyId: string }>();

export class StorageService {
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
      const key = `${companyId}/documents/${Date.now()}-${fileName}`;

      demoStorage.set(key, { buffer: fileBuffer, mimeType, companyId });
      const localPath = `/local-storage/${encodeURIComponent(key)}`;
      logger.info(`Demo mode: file stored locally at ${localPath}`);
      return localPath;
    } catch (error) {
      logger.error('Local upload error:', error);
      const key = `${companyId}/documents/${Date.now()}-${fileName}`;
      demoStorage.set(key, { buffer: fileBuffer, mimeType, companyId });
      return `/local-storage/${encodeURIComponent(key)}`;
    }
  }

  /**
   * Télécharger un fichier depuis S3
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      return demoStorage.get(key)?.buffer || Buffer.from('');
    } catch (error) {
      logger.error('Local download error:', error);
      return demoStorage.get(key)?.buffer || Buffer.from('');
    }
  }

  /**
   * Supprimer un fichier de S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      demoStorage.delete(key);
      logger.info(`Demo mode: file deleted locally: ${key}`);
    } catch (error) {
      logger.error('Local delete error:', error);
    }
  }

  /**
   * Générer une URL présignée pour accès temporaire
   */
  generatePresignedUrl(key: string, expiresIn: number = 3600): string {
    try {
      logger.info(`Demo mode: generating local URL for ${key} with ttl=${expiresIn}s`);
      return `/local-storage/${encodeURIComponent(key)}`;
    } catch (error) {
      logger.error('Local URL generation error:', error);
      return `/local-storage/${encodeURIComponent(key)}`;
    }
  }

  /**
   * Lister les fichiers d'une entreprise
   */
  async listFiles(companyId: string, prefix: string = ''): Promise<Array<{ Key?: string; Size?: number; LastModified?: Date }>> {
    try {
      return [...demoStorage.entries()]
        .filter(([key, value]) => value.companyId === companyId && key.startsWith(`${companyId}/${prefix}`))
        .map(([key, value]) => ({
          Key: key,
          Size: value.buffer.length,
          LastModified: new Date(),
        }));
    } catch (error) {
      logger.error('Local list error:', error);
      return [];
    }
  }
}

export default new StorageService();
