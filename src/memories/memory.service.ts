import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Memory } from './schemas/memory.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { MemoryDto } from './dto/memory.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { MemoryResponseDto } from './dto/memory-response.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { FilesService } from '../files/files.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class MemoryService {
  constructor(
    @InjectModel(Memory.name) private readonly memoryModel: Model<Memory>,
    private readonly filesService: FilesService,
  ) {}

  async create(createMemoryDto: MemoryDto, fileName: string): Promise<any> {
    const memoryContent = {
      dateCreated: createMemoryDto.dateCreated,
      filePath: fileName,
      contentType: createMemoryDto.contentType,
      description: createMemoryDto.description,
    };
    const memory = new this.memoryModel({
      title: createMemoryDto.title,
      description: createMemoryDto.description,
      tags: createMemoryDto.tags,
      familyMembers: createMemoryDto.familyMembers,
      memoryContent: [memoryContent],
    });
    return memory.save().catch((error) => {
      if (error?.errorResponse?.code === 11000)
        throw new BadRequestException('Title already exists');
      throw new InternalServerErrorException(error);
    });
  }

  async updateMemory(
    title: string,
    data: UpdateMemoryDto,
    fileName: string,
  ): Promise<any> {
    const memoryContent = {
      dateCreated: data.dateCreated,
      filePath: fileName,
      contentType: data.contentType,
      description: data.description,
    };
    const updated = await this.memoryModel
      .findOneAndUpdate(
        { title },
        { $push: { memoryContent } },
        {
          upsert: true,
          new: true,
        },
      )
      .exec()
      .catch((error) => {
        throw new BadRequestException(error);
      });

    return plainToInstance(MemoryResponseDto, updated.toObject());
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginationResponseDto<MemoryResponseDto>> {
    const query = this.memoryModel.find();
    pagination?.perPage && query.limit(pagination.perPage);
    pagination?.page && query.skip((pagination.page - 1) * pagination.perPage);
    const [data, total] = await Promise.all([
      query.exec(),
      this.memoryModel.countDocuments().exec(),
    ]);
    const result = {
      data: plainToInstance(MemoryResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      pages: Math.ceil(total / pagination?.perPage),
      total,
    };

    return result;
  }

  async findOne(title: string): Promise<MemoryResponseDto> {
    const result = this.memoryModel
      .findOne({ title })
      .orFail()
      .lean()
      .catch(() => {
        throw new NotFoundException();
      });

    return plainToInstance(MemoryResponseDto, result);
  }

  async delete(title: string): Promise<void> {
    const result = await this.memoryModel
      .findOneAndDelete({ title }, { includeResultMetadata: true })
      .exec();
    const files =
      result.value &&
      result.value.memoryContent
        .map(({ filePath }) => filePath)
        .filter((file) => file);
    files?.length && this.filesService.deleteFiles(files);
  }
}
