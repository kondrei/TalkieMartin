import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class WordParamDto {
  @ApiProperty()
  @Expose()
  @IsString()
  name: string;
}
