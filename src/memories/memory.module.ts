import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Memory, MemorySchema } from './schemas/memory.schema';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Module } from 'src/s3/s3.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
        },
      }),
    }),
    S3Module,
    JwtModule,
  ],
  controllers: [MemoryController],
  providers: [MemoryService],
})
export class MemoryModule {}
