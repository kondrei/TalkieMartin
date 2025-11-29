import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilePipe implements PipeTransform {
  constructor(private readonly fileTypes: string[]) {}

  transform(value: any) {
    if (!value) {
      return value;
    }

    const isValid = this.fileTypes.includes(value.mimetype);

    if (!isValid) {
      throw new BadRequestException(
        `Invalid file type. Expected one of: ${this.fileTypes.join(', ')}, but got: ${value.mimetype}`,
      );
    }

    return value;
  }
}
