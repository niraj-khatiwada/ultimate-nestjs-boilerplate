import { StorageFactory, StorageProvider } from './storage.factory';

describe('StorageFactory', () => {
  let factory: StorageFactory;
  let mockConfigService: any;
  let awsS3Service: any;
  let gcpGcsService: any;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn(),
      getOrThrow: jest.fn(),
    };

    awsS3Service = {
      uploadFile: jest.fn(),
      uploadBuffer: jest.fn(),
    };

    gcpGcsService = {
      uploadFile: jest.fn(),
      uploadBuffer: jest.fn(),
    };

    factory = new StorageFactory(
      mockConfigService,
      awsS3Service,
      gcpGcsService,
    );
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('getProvider', () => {
    it('should return AwsS3Service by default when STORAGE_PROVIDER is not set', () => {
      process.env.STORAGE_PROVIDER = undefined;
      const provider = factory.getProvider();
      expect(provider).toBe(awsS3Service);
    });

    it('should return AwsS3Service when STORAGE_PROVIDER=aws_s3', () => {
      process.env.STORAGE_PROVIDER = StorageProvider.AWS_S3;
      const provider = factory.getProvider();
      expect(provider).toBe(awsS3Service);
    });

    it('should return GcpGcsService when STORAGE_PROVIDER=gcp_gcs', () => {
      process.env.STORAGE_PROVIDER = StorageProvider.GCP_GCS;
      const provider = factory.getProvider();
      expect(provider).toBe(gcpGcsService);
    });

    afterEach(() => {
      delete process.env.STORAGE_PROVIDER;
    });
  });
});
