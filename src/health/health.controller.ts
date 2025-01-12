import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(private http: HttpHealthIndicator, private health: HealthCheckService, private configService: ConfigService) { }

    @Get("")
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('api_health', `http://localhost:${this.configService.get('PORT') || 3000}/api`),
        ]);
    }
}
