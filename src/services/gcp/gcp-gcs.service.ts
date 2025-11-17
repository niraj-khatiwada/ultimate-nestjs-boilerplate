import {
  CloudStorageUploadOptions,
  CloudStorageUploadResponse,
  ICloudStorageProvider,
} from '@/common/storage/storage-provider.interface';
import { GlobalConfig } from '@/config/config.type';
import { Bucket, Storage } from '@google-cloud/storage';
import { File } from '@nest-lab/fastify-multer';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GcpGcsService implements ICloudStorageProvider, OnModuleInit {
  private storage: Storage;
  private bucket: Bucket;

  constructor(private readonly configService: ConfigService<GlobalConfig>) {}

  onModuleInit() {
    const projectId = this.configService.get('gcp.projectId', {
      infer: true,
    });
    const keyFilePath = this.configService.get('gcp.keyFilePath', {
      infer: true,
    });

    const storageConfig: any = {
      projectId,
    };

    // If key file path is provided
    if (keyFilePath) {
      storageConfig.keyFilename = keyFilePath;
    }

    this.storage = new Storage(storageConfig);
    this.bucket = this.storage.bucket(
      this.configService.getOrThrow('gcp.bucket', { infer: true }),
    );
  }

  /**
   * Upload file to GCS
   * @param {File} file - File data
   * @param {CloudStorageUploadOptions} config - Upload configuration
   */
  async uploadFile(
    file: File,
    config: CloudStorageUploadOptions,
  ): Promise<CloudStorageUploadResponse> {
    const response = await this.uploadBuffer(file.buffer, config);
    return {
      ...response,
      size: response?.size ?? file?.size,
      mimetype: file?.mimetype,
    };
  }

  /**
   * Upload buffer to GCS
   * @param {Buffer} buffer - Binary data
   * @param {CloudStorageUploadOptions} config - Upload configuration
   */
  async uploadBuffer(
    buffer: Buffer,
    config: CloudStorageUploadOptions,
  ): Promise<CloudStorageUploadResponse> {
    const { path, filename } = this._constructFileObject(config);
    const file = this.bucket.file(path);

    const options: any = {
      public: true, // Public read access
    };

    if (config.contentType) {
      options.metadata = {
        contentType: config.contentType,
      };
    }

    await file.save(buffer, options);

    // Get file metadata
    const [metadata] = await file.getMetadata();

    return {
      path,
      size: Number(metadata.size),
      filename,
      originalname: config.filename,
    };
  }

  /**
   * Construct file object
   * @param {CloudStorageUploadOptions} config - Configuration
   * @returns Path and file name
   */
  private _constructFileObject = ({
    folder,
    filename,
    useEnv = true,
  }: CloudStorageUploadOptions): { path: string; filename?: string } => {
    filename = this._generateFilename(filename);
    let path = folder ? `${folder}/${filename}` : filename;
    if (useEnv) {
      path = `${this.configService.getOrThrow('app.nodeEnv', { infer: true })}/${path}`;
    }
    return {
      path,
      filename,
    };
  };

  /**
   * Generate unique file name
   * @param {string} name - Original file name
   * @returns Generated file name
   */
  private _generateFilename(name: string): string {
    return `${uuid()?.replace(/-/g, '')?.slice(0, 16)}-${name}`;
  }
}
