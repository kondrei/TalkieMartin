import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from './schemas/words.schema';
import { Model } from 'mongoose';
import { WordsDto } from './model';
import { NotFoundError } from 'rxjs';

@Injectable()
export class WordsService {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  async create(createWordDto: WordsDto): Promise<Word> {
    const createdWord = new this.wordModel(createWordDto);
    return createdWord.save().catch((error) => {
      throw new BadRequestException(error);
    });
  }

  async findAll(): Promise<Word[]> {
    return this.wordModel.find().exec();
  }

  async findOne(name: string): Promise<Word> {
    return this.wordModel
      .findOne({ name })
      .orFail()
      .catch(() => {
        throw new NotFoundException();
      });
  }
}
