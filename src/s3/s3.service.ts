import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

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

  async uploadFiles(
    bucketName: string,
    files: Array<{ fileObject: Express.Multer.File; fileName: string }> = [],
  ): Promise<void> {
    const s3Client = new S3Client({});
    
    try {
      await Promise.all(
        files.map(async (file) => {
          await s3Client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              Key: file.fileName,
              Body: file.fileObject.buffer,
              ContentType: file.fileObject.mimetype,
            }),
          );
        }),
      );
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async getDownloadUrl(
    bucketName: string,
    fileName: string,
  ): Promise<string | null> {
    const s3Client = new S3Client({});
    if ((await this.checkFileExists(bucketName, fileName)) === false) {
      return null;
    }
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {}
  }

  async deleteFiles(bucketName: string, fileNames: string[]): Promise<boolean> {
    const s3Client = new S3Client({});
    try {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: { Objects: fileNames.map((file) => ({ Key: file })) },
        }),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
