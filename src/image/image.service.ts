import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async optimizeImage(image: Express.Multer.File): Promise<Buffer> {
    try {
      const optimizedImageBuffer = await sharp(image.buffer)
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      return optimizedImageBuffer;
    } catch (error) {
      throw new Error('Failed to optimize image');
    }
  }
}
