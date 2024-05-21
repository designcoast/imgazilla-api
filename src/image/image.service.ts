import { Injectable } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageService {
  constructor(
    @InjectQueue('image-processing') private readonly processingQueue: Queue,
  ) {}
  async optimizeImage(data: any): Promise<any> {
    const chunkId = uuid();
    await this.processingQueue.add(chunkId, data);
  }
}
