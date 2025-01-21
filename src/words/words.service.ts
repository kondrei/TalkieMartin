import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from './schemas/words.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { WordsDto } from './dto/words.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { WordsResponseDto } from './dto/words-response.dto copy';

@Injectable()
export class WordsService {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  async create(createWordDto: WordsDto, fileName: string): Promise<any> {
    const wordData = {
      dateLearned: createWordDto.dateLearned,
      path: fileName,
    };
    const updated = await this.wordModel
      .findOneAndUpdate(
        { name: createWordDto.name },
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
}
