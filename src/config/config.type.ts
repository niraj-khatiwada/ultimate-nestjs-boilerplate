import { AuthConfig } from '@/config/auth/auth-config.type';
import { AwsConfig } from '@/config/aws/aws-config.types';
import { DatabaseConfig } from '@/config/database/database-config.type';
import { GcpConfig } from '@/config/gcp/gcp-config.types';
import { GrafanaConfig } from '@/config/grafana/grafana.type';
import { MailConfig } from '@/config/mail/mail-config.type';
import { RedisConfig } from '@/config/redis/redis-config.type';
import { SentryConfig } from '@/config/sentry/sentry-config.type';
import { ThrottlerConfig } from '@/config/throttler/throttler-config.type';
import { AppConfig } from './app/app-config.type';
import { BullConfig } from './bull/bull-config.type';

export type GlobalConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  auth: AuthConfig;
  mail: MailConfig;
  sentry: SentryConfig;
  queue: BullConfig;
  throttler: ThrottlerConfig;
  aws: AwsConfig;
  gcp: GcpConfig;
  grafana: GrafanaConfig;
};
