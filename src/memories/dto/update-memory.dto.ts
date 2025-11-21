import { OmitType } from '@nestjs/swagger';
import { MemoryDto } from './memory.dto';

export class UpdateMemoryDto extends OmitType(MemoryDto, ['title']) {}
