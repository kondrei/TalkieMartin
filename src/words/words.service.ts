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

@Injectable()
export class WordsService {
  constructor(
    @InjectModel(Word.name) private readonly wordModel: Model<Word>,
  ) {}

  async create(createWordDto: WordsDto, fileName: string): Promise<any> {
    const wordData = {
      dateLearned: createWordDto.dateLearned,
      filePath: fileName,
    };
    console.log('Received DTO:', createWordDto);
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

  async findAll(): Promise<PaginationResponseDto<WordsResponseDto>> {
    const [data, total] = await Promise.all([
      this.wordModel.find().lean().exec(),
      this.wordModel.countDocuments().exec(),
    ]);
    const result = {
      data: plainToInstance(WordsResponseDto, data, {
        excludeExtraneousValues: true,
      }),
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
      result.value && result.value.wordData.map(({ filePath: path }) => path);
    console.log('deleting files', files);
    // todo create a file service that takes an array of files and delete them
  }
}
