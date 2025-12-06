import { File } from '@nest-lab/fastify-multer';

/**
 * Common configuration for cloud storage upload options
 */
export interface CloudStorageUploadOptions {
  /** File name */
  filename: string;
  /** Folder path (optional) */
  folder?: string;
  /** Whether to use environment isolation (default: true) */
  useEnv?: boolean;
  /** File MIME type (optional) */
  contentType?: string;
}

/**
 * Common format for cloud storage upload response
 */
export interface CloudStorageUploadResponse {
  /** File storage path */
  path: string;
  /** File size */
  size?: number;
  /** File MIME type */
  mimetype?: string;
  /** Generated file name */
  filename?: string;
  /** Original file name */
  originalname?: string;
}

/**
 * Unified interface for cloud storage providers
 * All storage implementations (AWS S3, GCP GCS, etc.) should implement this interface
 */
export interface ICloudStorageProvider {
  /**
   * Upload a single file
   * @param file - File object
   * @param config - Upload configuration
   * @returns Upload result
   */
  uploadFile(
    file: File,
    config: CloudStorageUploadOptions,
  ): Promise<CloudStorageUploadResponse>;

  /**
   * Upload buffer data
   * @param buffer - Binary data
   * @param config - Upload configuration
   * @returns Upload result
   */
  uploadBuffer(
    buffer: Buffer,
    config: CloudStorageUploadOptions,
  ): Promise<CloudStorageUploadResponse>;
}
