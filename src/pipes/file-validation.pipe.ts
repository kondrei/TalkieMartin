import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilePipe implements PipeTransform {
  constructor(private readonly fileTypes: string[]) {}

  transform(value: any) {
    if (!value) {
      return value;
    }

    value.forEach((file: Express.Multer.File) => {
      const isValid = this.fileTypes.includes(file.mimetype);

      if (!isValid) {
        throw new BadRequestException(
          `Invalid file type. Expected one of: ${this.fileTypes.join(', ')}, but got: ${file.mimetype}`,
        );
      }
    });

    return value;
  }
}
