import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Memory } from './schemas/memory.schema';
import { Connection, Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { FileNamesDto, MemoryContentDto, MemoryDto } from './dto/memory.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { MemoryResponseDto } from './dto/memory-response.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { PaginationDto } from './dto/pagination.dto';
import { S3Service } from '../s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MemoryService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Memory.name)
    private readonly memoryModel: Model<Memory>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createMemoryDto: MemoryDto,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const memoryContent: MemoryContentDto[] = [];
      const fileNames: FileNamesDto[] = [];
      files.map((file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        memoryContent.push({
          dateCreated: createMemoryDto.dateCreated,
          filePath: fileName,
          contentType: file.mimetype,
          description: createMemoryDto.description,
        });
        fileNames.push({
          fileObject: file,
          fileName: fileName,
        });
      });

      const memory = new this.memoryModel({
        title: createMemoryDto.title,
        description: createMemoryDto.description,
        tags: createMemoryDto.tags,
        familyMembers: createMemoryDto.familyMembers,
        memoryContent: memoryContent,
      });
      await memory.save({ session }).catch((error) => {
        if (error?.errorResponse?.code === 11000)
          throw new BadRequestException('Title already exists');
        throw new InternalServerErrorException(error);
      });

      await this.s3Service.uploadFiles(
        this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        fileNames,
      );

      await session.commitTransaction();
      session.endSession();
      return memory;
    } catch (error) {
      await session.abortTransaction();

      session.endSession();
      throw error;
    }
  }

  async updateMemory(
    title: string,
    data: UpdateMemoryDto,
    fileName: string,
  ): Promise<any> {
    const memoryContent = {
      dateCreated: data.dateCreated,
      filePath: fileName,
      contentType: 'file.mimetype',
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
    pagination?.currentPage &&
      query.skip((pagination.currentPage - 1) * pagination.perPage);
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
      currentPage: pagination?.page || 1,
    };

    return result;
  }

  async findOne(title: string): Promise<MemoryResponseDto> {
    const result = await this.memoryModel
      .findOne({ title })
      .orFail()
      .lean()
      .catch(() => {
        throw new NotFoundException();
      });

    return plainToInstance(
      MemoryResponseDto,
      await this.attachDownloadUrl(result),
    );
  }

  async delete(title: string): Promise<void> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const result = await this.memoryModel
        .findOneAndDelete({ title }, { includeResultMetadata: true, session })
        .exec();
      if (!result.value) {
        throw new NotFoundException('Memory not found');
      }
      const files =
        result.value &&
        result.value.memoryContent
          .map(({ filePath }) => filePath)
          .filter((file) => file);

      const deleted = await this.s3Service.deleteFiles(
        this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        files,
      );
      if (!deleted) {
        throw new BadRequestException('Failed to delete files from S3');
      }
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();

      session.endSession();
      throw error;
    }
  }

  private async attachDownloadUrl(
    result: MemoryResponseDto,
  ): Promise<MemoryResponseDto> {
    const memoryFiles = result.memoryContent.map((mc) => mc.filePath);
    const s3Paths = await Promise.all(
      memoryFiles.map((filePath) =>
        this.s3Service.getDownloadUrl(
          this.configService.get<string>('AWS_S3_BUCKET_NAME'),
          filePath,
        ),
      ),
    );
    result.memoryContent.forEach((item, idx) => {
      item.filePath = s3Paths[idx];
    });
    return result;
  }
}
