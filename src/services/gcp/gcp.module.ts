import { Module } from '@nestjs/common';
import { GcpGcsService } from './gcp-gcs.service';

@Module({
  providers: [GcpGcsService],
  exports: [GcpGcsService],
})
export class GcpModule {}
