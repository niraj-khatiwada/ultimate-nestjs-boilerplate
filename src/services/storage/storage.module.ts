import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { GcpModule } from '../gcp/gcp.module';
import { StorageFactory } from './storage.factory';

@Module({
  imports: [AwsModule, GcpModule],
  providers: [StorageFactory],
  exports: [StorageFactory],
})
export class StorageModule {}
