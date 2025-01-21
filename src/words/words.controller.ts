import {
  Body,
  Controller,
  FileTypeValidator,
  FileValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WordsService } from './words.service';
import { FindWordDto } from './dto/find-word.dto';
import { WordsDto } from './dto/words.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { WordsResponseDto } from './dto/words-response.dto copy';
import { FilePipe } from 'src/pipes/file-validation.pipe';

@ApiTags('Words collections')
@ApiExtraModels(PaginationResponseDto, WordsDto)
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all known learned words.' })
  async getWordsList(): Promise<PaginationResponseDto<WordsResponseDto>> {
    return await this.wordsService.findAll();
  }

  @ApiOperation({ summary: 'Get one word by name.' })
  @Get(':name')
  async findWord(@Param() params: FindWordDto) {
    const word = this.wordsService.findOne(params.name);
    return word;
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Add a new word or a new pronunciation of an existing word.',
  })
  @ApiBody({ type: WordsDto })
  async addWord(
    @Body() words: WordsDto,
    @UploadedFile(new FilePipe('audio/mpeg'))
    file: Express.Multer.File,
  ) {
    return this.wordsService.create(words, file?.filename);
  }
}
