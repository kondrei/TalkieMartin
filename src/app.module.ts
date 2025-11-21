import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MemoryModule } from './memories/memory.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    HealthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: config.get('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MemoryModule,
    FilesModule,
  ],
})
export class AppModule {}
