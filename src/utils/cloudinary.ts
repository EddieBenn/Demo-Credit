/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FileUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const allowedMimeTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'image/gif',
        'image/avif',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return reject(
          new Error(
            'Only .png, .jpg, .jpeg, .webp, .gif, and .avif formats are allowed',
          ),
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return reject(new Error('File size exceeds 5MB limit'));
      }

      try {
        cloudinary.uploader.upload(
          file.path,
          { folder: 'Demo-Credit' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}
