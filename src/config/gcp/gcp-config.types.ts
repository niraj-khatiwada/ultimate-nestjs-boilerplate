export type GcpConfig = {
  projectId: string;
  bucket: string;
  keyFilePath?: string;
};

export type GcpGcsUploadOptions = {
  filename: string;
  folder?: string;
  useEnv?: boolean;
  contentType?: string;
};

export type GcpGcsUploadResponse = {
  path: string;
  size?: number;
  mimetype?: string;
  filename?: string;
  originalname?: string;
};
