import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, Max } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Transform(({ value }) => Number(value) || 1)
  @Max(255)
  page: number = 1;

  @ApiProperty({ default: 25 })
  @Expose()
  @IsNumber()
  @Transform(({ value }) => Number(value) || 25)
  @Max(255)
  perPage: number = 25;

  @ApiProperty({ default: 25 })
  @Expose()
  @IsNumber()
  @Transform(({ value }) => Number(value) || 25)
  @Max(255)
  currentPage: number = 25;
}
