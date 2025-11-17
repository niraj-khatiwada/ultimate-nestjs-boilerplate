import { StorageModule } from '@/services/storage/storage.module';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [FastifyMulterModule, StorageModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
