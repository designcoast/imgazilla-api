import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';
// import * as sharp from 'sharp';
import { decode, encode } from 'base64-arraybuffer';
// import * as PDFDocument from 'pdfkit';

import { getImageOptimizationFnByFormat } from '~/image/image.utils';
import { DEFAULT_BITE_SIZE, IMAGE_OPTIMISATION_FORMATS } from '~/constants';
import { ImageOptimizationDto } from '~/image/dto/optimaze-image.dto';
import { ImageProcessorFactory } from '~/factories/ImageProcessorFactory';

@Processor('image-processing')
export class ImageQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageQueueProcessor.name);

  async process(job: Job) {
    try {
      return await Promise.all(
        job.data.map(
          async ({
            name,
            uuid,
            base64Image,
            optimizationPercent,
            format,
            settings,
          }: ImageOptimizationDto) => {
            const fileFormat = format.toLowerCase();
            const buffer = Buffer.from(decode(base64Image));
            const processor = ImageProcessorFactory.getProcessor(
              fileFormat,
              buffer,
              optimizationPercent,
              settings,
            );

            const processedBuffer = await processor.process();

            const sourceImageInBytes = buffer.byteLength;
            const sourceImageSize = sourceImageInBytes / DEFAULT_BITE_SIZE;

            const sizeInBytes = processedBuffer.length;
            const sizeInKB = sizeInBytes / DEFAULT_BITE_SIZE;

            const response = {
              uuid,
              name: settings?.suffix ? `${name}_${settings.suffix}` : name,
              base64Image: encode(processedBuffer),
              optimizedImageSize: sizeInKB,
              sourceImageSize,
            };

            if (fileFormat === IMAGE_OPTIMISATION_FORMATS.PDF) {
              response['pdfBuffer'] = encode(processedBuffer);
            }

            return response;
          },
        ),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
