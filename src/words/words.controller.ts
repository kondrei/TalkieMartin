import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { WordParamDto } from './dto/word-params.dto';
import { WordsDto } from './dto/words.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { WordsResponseDto } from './dto/words-response.dto';
import { FilePipe } from 'src/pipes/file-validation.pipe';
import { plainToInstance } from 'class-transformer';
import { UpdateWordDto } from './dto/uodate-words.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Words collections')
@ApiExtraModels(PaginationResponseDto, WordsDto)
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all known learned words.' })
  async getWordsList(
    @Query() param: PaginationDto,
  ): Promise<PaginationResponseDto<WordsResponseDto>> {
    return await this.wordsService.findAll(param);
  }

  @ApiOperation({ summary: 'Get one word by name.' })
  @Get(':name')
  async findWord(@Param() params: WordParamDto) {
    const word = this.wordsService.findOne(params.name);
    return word;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Add a new word',
  })
  @ApiBody({ type: WordsDto })
  async addWord(
    @Body() words: WordsDto,
    @UploadedFile(new FilePipe('audio/mpeg'))
    file: Express.Multer.File,
  ) {
    const result = await this.wordsService.create(words, file?.filename);
    return plainToInstance(WordsResponseDto, result.toObject());
  }

  @Put(':name')
  @ApiOperation({
    summary: 'Update words',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updateWord(
    @Param() param: WordParamDto,
    @Body() wordData: UpdateWordDto,
    @UploadedFile(new FilePipe('audio/mpeg'))
    file: Express.Multer.File,
  ) {
    return this.wordsService.updateWord(param.name, wordData, file.filename);
  }

  @Delete(':name')
  @ApiOperation({
    summary: 'Delete a word and all associated files',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWord(@Param() params: WordParamDto) {
    return await this.wordsService.delete(params.name);
  }
}
