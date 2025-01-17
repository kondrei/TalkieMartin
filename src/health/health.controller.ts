import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private http: HttpHealthIndicator,
    private health: HealthCheckService,
    private configService: ConfigService,
    private mongoose: MongooseHealthIndicator,
  ) {}

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
    ]);
  }
}


