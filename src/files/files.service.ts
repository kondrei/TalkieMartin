import { Injectable, Logger } from '@nestjs/common';
import path from 'node:path';
import { promises as fs } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly configService: ConfigService) {}
  async deleteFiles(files: string[]): Promise<void> {
    const storagePath = path.resolve(this.configService.get('FILES_PATH'));
    try {
      await Promise.all(
        files.map(async (file) => await fs.unlink(`${storagePath}/${file}`)),
      ).then((a) => this.logger.log(`${files.length} files deleted`));
    } catch (error) {
      this.logger.error(`Can not delete files: ${error.message}`);
    }
  }
}
