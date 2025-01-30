import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class WordsDto {
  @ApiProperty({ default: '' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ default: new Date().toLocaleDateString() })
  @IsDate()
  @Type(() => Date)
  @Expose()
  dateLearned: Date;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
