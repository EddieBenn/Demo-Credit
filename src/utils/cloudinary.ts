/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import * as dotenv from 'dotenv';
import { Request } from 'express';

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

  private storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file) => {
      return {
        folder: 'Demo-Credit',
      };
    },
  });

  public upload = multer({
    storage: this.storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req: Request, file, cb) => {
      const allowedMimeTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'image/gif',
        'image/avif',
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            'Only .png, .jpg, .jpeg, .webp, .gif, and .avif formats are allowed',
          ),
        );
      }
    },
  });
}
