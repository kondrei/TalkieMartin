import {
  HeadBucketCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';

@Injectable()
export class S3Service {
  async checkBucketExists(bucketName: string): Promise<boolean> {
    const s3Client = new S3Client({});
    try {
      const result = await s3Client.send(
        new HeadBucketCommand({ Bucket: bucketName }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  async checkFileExists(
    bucketName: string,
    fileName: string,
  ): Promise<boolean> {
    const s3Client = new S3Client({});
    try {
      await s3Client.send(
        new HeadObjectCommand({ Bucket: bucketName, Key: fileName }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async uploadFile(
    bucketName: string,
    fileName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const s3Client = new S3Client({});

    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('File buffer is empty or missing');
    }
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      await this.checkFileExists(bucketName, fileName);

      return fileName;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
