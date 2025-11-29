import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TerminusModule, HttpModule, S3Module],
  controllers: [HealthController],
})
export class HealthModule {}
