import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/config/validate-config';
import { GcpConfig } from './gcp-config.types';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  GCP_PROJECT_ID: string;

  @IsString()
  @IsOptional()
  GCP_BUCKET: string;

  @IsString()
  @IsOptional()
  GCP_KEY_FILE_PATH: string;
}

export function getConfig(): GcpConfig {
  return {
    projectId: process.env.GCP_PROJECT_ID,
    bucket: process.env.GCP_BUCKET,
    keyFilePath: process.env.GCP_KEY_FILE_PATH,
  };
}

export default registerAs<GcpConfig>('gcp', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering GcpConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
