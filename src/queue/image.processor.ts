import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';
import * as sharp from 'sharp';
import { decode, encode } from 'base64-arraybuffer';

import { getImageOptimizationFnByFormat } from '~/image/image.utils';
import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';
import { ImageOptimizationDto } from '~/image/dto/optimaze-image.dto';

@Processor('image-processing')
export class ImageQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageQueueProcessor.name);

  async process(job: Job) {
    try {
      return await Promise.all(
        job.data.map(
          async ({
            base64Image,
            optimizationPercent,
          }: ImageOptimizationDto) => {
            const buffer = decode(base64Image);
            const imageProcessor = sharp(buffer).toFormat(
              IMAGE_OPTIMISATION_FORMATS.PNG,
            );

            const imageBuffer = await getImageOptimizationFnByFormat(
              IMAGE_OPTIMISATION_FORMATS.PNG,
            )(imageProcessor, optimizationPercent).toBuffer();

            const sizeInBytes = imageBuffer.length;
            const sizeInKB = sizeInBytes / 1024;

            return {
              base64Image: encode(imageBuffer),
              optimizedImageSize: sizeInKB,
            };
          },
        ),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
