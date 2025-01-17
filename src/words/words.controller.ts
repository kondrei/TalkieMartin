import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WordsService } from './words.service';
import { FindWordDto, WordsDto } from './model';

@ApiTags('Words collections')
@Controller('words')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Get()
  async getWordsList() {
    const getWordsList = await this.wordsService.findAll();
    return { data: getWordsList };
  }

  @Get(':name')
  async findWord(@Param() params: FindWordDto) {
    const word = this.wordsService.findOne(params.name);
    return word;
  }

  @Post()
  async addWord(@Body() words: WordsDto) {
    return this.wordsService.create(words);
  }
}
