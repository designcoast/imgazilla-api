import { Injectable, Logger } from '@nestjs/common';

import { gradioClient } from '~/utils/gradioClient.utils';
import { fetchImageAsBuffer } from '~/utils/fetchImageAsBuffer';

@Injectable()
export class BackgroundRemovalService {
  private readonly logger = new Logger(BackgroundRemovalService.name);

  async removeImageBackground(imageData: Uint8Array) {
    try {
      const client = await gradioClient();
      const result = await client.predict('/predict', {
        input_path: imageData,
        param_8: '',
      });
      const imageURL = result.data[0].url;
      return await fetchImageAsBuffer(imageURL);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
