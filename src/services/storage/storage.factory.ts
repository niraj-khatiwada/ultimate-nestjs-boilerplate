import { ICloudStorageProvider } from '@/common/storage/storage-provider.interface';
import { GlobalConfig } from '@/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '../aws/aws-s3.service';
import { GcpGcsService } from '../gcp/gcp-gcs.service';

export enum StorageProvider {
  AWS_S3 = 'aws_s3',
  GCP_GCS = 'gcp_gcs',
}

@Injectable()
export class StorageFactory {
  constructor(
    private readonly configService: ConfigService<GlobalConfig>,
    private readonly awsS3Service: AwsS3Service,
    private readonly gcpGcsService: GcpGcsService,
  ) {}

  /**
   * Get the corresponding storage provider based on environment configuration
   * @returns Storage provider instance
   */
  getProvider(): ICloudStorageProvider {
    const provider = (process.env.STORAGE_PROVIDER ||
      StorageProvider.AWS_S3) as StorageProvider;

    switch (provider) {
      case StorageProvider.GCP_GCS:
        return this.gcpGcsService;
      case StorageProvider.AWS_S3:
      default:
        return this.awsS3Service;
    }
  }
}
