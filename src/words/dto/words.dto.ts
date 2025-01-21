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

export class WordDataDto {}

export class WordsDto {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  //   @ApiProperty({ type: WordDataDto })
  //   @Type(() => WordDataDto)
  //   @ValidateNested({ each: true })
  //   @Expose()
  //   wordData: WordDataDto[] = [];

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @Expose()
  dateLearned: Date;

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  path: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: Express.Multer.File;
}
