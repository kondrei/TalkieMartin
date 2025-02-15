import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from './schemas/words.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { WordsDto } from './dto/words.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { WordsResponseDto } from './dto/words-response.dto';
import { UpdateWordDto } from './dto/uodate-words.dto';
import { FilesService } from '../files/files.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectModel(Word.name) private readonly wordModel: Model<Word>,
    private readonly filesService: FilesService,
  ) {}

  async create(createWordDto: WordsDto, fileName: string): Promise<any> {
    const wordData = {
      dateLearned: createWordDto.dateLearned,
      filePath: fileName,
    };
    const updated = new this.wordModel({
      name: createWordDto.name,
      wordData: [wordData],
    });
    return updated.save().catch((error) => {
      if (error?.errorResponse?.code === 11000)
        throw new BadRequestException('Name already exists');
      throw new InternalServerErrorException(error);
    });
  }

  async updateWord(
    word: string,
    data: UpdateWordDto,
    fileName: string,
  ): Promise<any> {
    const wordData = {
      dateLearned: data.dateLearned,
      filePath: fileName,
    };
    const updated = await this.wordModel
      .findOneAndUpdate(
        { name: word },
        { $push: { wordData } },
        {
          upsert: true,
          new: true,
        },
      )
      .exec()
      .catch((error) => {
        throw new BadRequestException(error);
      });

    return plainToInstance(WordsResponseDto, updated.toObject());
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginationResponseDto<WordsResponseDto>> {
    const query = this.wordModel.find();
    pagination.perPage && query.limit(pagination.perPage);
    pagination.page && query.skip(pagination.page);
    const [data, total] = await Promise.all([
      query.exec(),
      this.wordModel.countDocuments().exec(),
    ]);
    const result = {
      data: plainToInstance(WordsResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      pages: Math.round(total / pagination.perPage),
      total,
    };

    return result;
  }

  async findOne(name: string): Promise<WordsResponseDto> {
    const result = this.wordModel
      .findOne({ name })
      .orFail()
      .lean()
      .catch(() => {
        throw new NotFoundException();
      });

    return plainToInstance(WordsResponseDto, result);
  }

  async delete(name: string): Promise<void> {
    const result = await this.wordModel
      .findOneAndDelete({ name }, { includeResultMetadata: true })
      .exec();
    const files =
      result.value &&
      result.value.wordData
        .map(({ filePath }) => filePath)
        .filter((file) => file);
    files?.length && this.filesService.deleteFiles(files);
  }
}
