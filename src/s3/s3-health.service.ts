import { Injectable } from "@nestjs/common";
import { HealthIndicator } from "@nestjs/terminus";
import { S3Service } from "src/s3/s3.service";

@Injectable()
export class S3HealthService extends HealthIndicator {
    constructor(
        private readonly s3Service: S3Service,
    ) {
        super();
    }
    public async check(key: string, bucketName: string): Promise<any> {
        const isHealthy = await this.s3Service.checkBucketExists(bucketName);
        return super.getStatus(key, isHealthy);
    }
}

