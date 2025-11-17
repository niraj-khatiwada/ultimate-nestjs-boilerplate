import { StorageFactory } from '@/services/storage/storage.factory';
import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly storageFactory: StorageFactory) {}

  async uploadFile(file: File) {
    if (file.destination) {
      return file;
    }
    const storageProvider = this.storageFactory.getProvider();
    return await storageProvider.uploadFile(file, {
      filename: file.originalname,
    });
  }

  async uploadMultipleFiles(files: File[]) {
    if (files[0].destination) {
      return files;
    }
    const storageProvider = this.storageFactory.getProvider();
    return await Promise.all(
      files.map((file) =>
        storageProvider.uploadFile(file, {
          filename: file.originalname,
        }),
      ),
    );
  }
}
