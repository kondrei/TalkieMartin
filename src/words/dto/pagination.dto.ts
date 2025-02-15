import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, Max } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Transform(() => Number())
  @Max(255)
  page: number;

  @ApiProperty({ default: 25 })
  @Expose()
  @IsNumber()
  @Transform(() => Number())
  @Max(255)
  perPage: number;
}
