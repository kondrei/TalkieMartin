import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class WordsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateLearned: Date;

  @ApiPropertyOptional()
  @IsString()
  path: string;
}

export class FindWordDto {
  @ApiProperty()
  @IsString()
  name: string;
}
