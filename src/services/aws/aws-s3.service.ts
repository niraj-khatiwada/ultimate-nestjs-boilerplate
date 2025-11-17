import { ICloudStorageProvider } from '@/common/storage/storage-provider.interface';
import { GlobalConfig } from '@/config/config.type';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import {
  AwsS3UploadOptions,
  AwsS3UploadResponse,
} from '../../config/aws/aws-config.types';

@Injectable()
export class AwsS3Service implements ICloudStorageProvider {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService<GlobalConfig>) {
    this.s3Client = new S3Client({
      region: this.configService.get('aws.region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKey', { infer: true }),
        secretAccessKey: this.configService.get('aws.secretKey', {
          infer: true,
        }),
      },
    });
  }

  /**
   * Uploads a file to s3
   * @param {File} file - data to be saved
   * @param {AwsS3UploadOptions} config - Configuration for upload
   */
  async uploadFile(
    file: File,
    config: AwsS3UploadOptions,
  ): Promise<AwsS3UploadResponse> {
    const response = await this.uploadBuffer(file.buffer, config);
    return {
      ...response,
      size: response?.size ?? file?.size,
      mimetype: file?.mimetype,
    };
  }

  /**
   * Uploads a buffer to s3
   * @param {Buffer} buffer - Buffer data
   * @param {AwsS3UploadOptions} config - Configuration for upload
   */
  async uploadBuffer(
    buffer: Buffer,
    config: AwsS3UploadOptions,
  ): Promise<AwsS3UploadResponse> {
    const { path, filename } = this._constructFileObject(config);
    const putObjectInput: PutObjectCommandInput = {
      Bucket: this.configService.getOrThrow('aws.bucket', { infer: true }),
      Key: path,
      Body: buffer,
      ACL: 'public-read',
    };
    if (config.contentType) {
      putObjectInput.ContentType = config.contentType;
    }
    const res = await this.s3Client.send(new PutObjectCommand(putObjectInput));
    return {
      path,
      size: res.Size,
      filename,
      originalname: config.filename,
    };
  }

  /**
   * Constructs object for the file
   * @param {AwsS3UploadOptions} config - configuration
   * @returns {string} - Key value
   */
  private _constructFileObject = ({
    folder,
    filename,
    useEnv = true,
  }: AwsS3UploadOptions): { path: string; filename?: string } => {
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

  private _generateFilename(name: string): string {
    return `${uuid()?.replace(/-/g, '')?.slice(0, 16)}-${name}`;
  }
}
