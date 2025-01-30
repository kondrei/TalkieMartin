import { OmitType } from '@nestjs/swagger';
import { WordsDto } from './words.dto';

export class UpdateWordDto extends OmitType(WordsDto, ['name']) {}
