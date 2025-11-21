import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, Transform } from 'class-transformer';
import { IsDate, IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { MemoryTypes } from '../types/memory-types';

export class MemoryDto {
  @ApiProperty({ default: '' })
  @IsString()
  @Expose()
  title: string = '';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  description: string = '';

  @ApiProperty({ default: new Date().toISOString() })
  @IsDate()
  @Type(() => Date)
  @Expose()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return new Date();
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  })
  dateCreated: Date = new Date();

  @ApiProperty({ enum: MemoryTypes })
  @IsEnum(MemoryTypes)
  @Expose()
  contentType: string;

  @ApiProperty({  required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  @Transform(({ value }) => Array.isArray(value) ? value : value.split(','))
  tags: string[] = [];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Expose()
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  familyMembers: string[] = [];

  // @ApiProperty({ type: 'string', format: 'binary', required: true })
  // file: Express.Multer.File;
}
