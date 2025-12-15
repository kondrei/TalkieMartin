import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { S3HealthService } from '../s3/s3-health.service';
import { Public } from '../decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    private http: HttpHealthIndicator,
    private health: HealthCheckService,
    private configService: ConfigService,
    private mongoose: MongooseHealthIndicator,
    private readonly s3HealthService: S3HealthService,
  ) {}

  @ApiOperation({ summary: 'Get health of HTTP server and DB connection' })
  @Get('')
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'api_health',
          `http://localhost:${this.configService.get('PORT') || 3000}/api`,
        ),
      ,
      async () => this.mongoose.pingCheck('mongoose'),
      async () =>
        this.s3HealthService.check(
          's3_bucket',
          this.configService.get('AWS_S3_BUCKET_NAME'),
        ),
    ]);
  }
}
