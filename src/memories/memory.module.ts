import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Memory, MemorySchema } from './schemas/memory.schema';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesModule } from '../files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('FILES_PATH'),
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
    FilesModule,
  ],
  controllers: [MemoryController],
  providers: [MemoryService],
})
export class MemoryModule {}
