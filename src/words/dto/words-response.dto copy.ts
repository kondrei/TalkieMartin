import { UploadedFile } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WordDataDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Expose()
  dateLearned: Date;

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  path: string;
}

export class WordsResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: WordDataDto })
  @Type(() => WordDataDto)
  @ValidateNested({ each: true })
  @Expose()
  wordData: WordDataDto[] = [];
}
