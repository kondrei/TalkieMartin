import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class FindWordDto {
  @ApiProperty()
  @Expose()
  @IsString()
  name: string;
}
