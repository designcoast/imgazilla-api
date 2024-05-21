import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';
import * as sharp from 'sharp';
import { decode } from 'base64-arraybuffer';

import { getImageOptimizationFnByFormat } from '~/image/image.utils';
import { ImageOptions } from '~/types';
import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';

@Processor('image-processing')
export class ImageQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageQueueProcessor.name);

  async process(job: Job) {
    const result = await Promise.all(
      job.data.map(async ({ uintArray, optimizationPercent }: ImageOptions) => {
        const buffer = decode(uintArray);
        const imageProcessor = sharp(buffer).toFormat(
          IMAGE_OPTIMISATION_FORMATS.PNG,
        );

        return await getImageOptimizationFnByFormat(
          IMAGE_OPTIMISATION_FORMATS.PNG,
        )(imageProcessor, optimizationPercent).toBuffer();
      }),
    );
    return result;
  }
}
