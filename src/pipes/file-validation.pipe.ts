import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { FileTypeValidator } from '@nestjs/common/pipes';

@Injectable()
export class FilePipe implements PipeTransform {
  constructor(private readonly fileType: string) {}

  transform(value: any) {
    if (!value) {
      return value;
    }

    const fileTypeValidator = new FileTypeValidator({
      fileType: this.fileType,
    });
    const isValid = fileTypeValidator.isValid(value);

    if (!isValid) {
      throw new BadRequestException(
        `Invalid file type. Expected: ${this.fileType}`,
      );
    }

    return value;
  }
}
