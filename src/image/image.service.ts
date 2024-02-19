import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { IImageOptimizationOptions } from '~/types';
import { getImageOptimizationFnByFormat } from '~/image/image.utils';

@Injectable()
export class ImageService {
  async optimizeImage(
    image: Buffer,
    options: IImageOptimizationOptions,
  ): Promise<any> {
    try {
      const { quality, outputFormat } = options;

      const imageProcessor = sharp(image.buffer).toFormat(outputFormat);

      const optimizedImageBuffer = await getImageOptimizationFnByFormat(
        outputFormat,
      )(imageProcessor, quality).toBuffer();

      //TODO: Add logging here
      return optimizedImageBuffer;
    } catch (error) {
      throw new Error('Failed to optimize image');
    }
  }
}
