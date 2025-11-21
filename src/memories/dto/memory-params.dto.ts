import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class MemoryParamDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return '';
    return String(value).trim();
  })
  title: string = '';
}
