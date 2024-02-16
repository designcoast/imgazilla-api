import * as fs from 'fs';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';

import * as sharp from 'sharp';
import * as archiver from 'archiver';

import { GenerateFaviconOptionsDto } from './dto/generate-favicon.dto';
import { createIcoImage, createPlane, createRawImage } from '~/utils/ico.utils';
import { IIconOptions } from '~/types';
import { getPlatformOptions } from '~/utils/platforms.utils';
import { getIconOptions } from '~/utils/icons';

export interface ISourceSet {
  imgBuffer: Buffer;
  metadata: sharp.Metadata;
}

@Injectable()
export class FaviconService {
  async generateFavicon(
    imageBuffer: Buffer,
    options: GenerateFaviconOptionsDto,
  ) {
    const { platforms } = options;

    const source = {
      imgBuffer: imageBuffer,
      metadata: await sharp(imageBuffer).metadata(),
    };

    const responses = [];

    for (const platform of platforms) {
      const platformOptions = getPlatformOptions(platform);

      const result = await Promise.all(
        platformOptions.map((iconOptions: IIconOptions) =>
          this.createImages(source, iconOptions),
        ),
      );

      responses.push(...result.filter(Boolean));
    }

    return responses;
  }

  private async createImages(source: ISourceSet, options: IIconOptions) {
    const props = getIconOptions(options);
    const ext = extname(options.name);

    if (ext === '.ico') {
      const planeImages = await Promise.all(
        props.map((prop) => createPlane(source, prop).then(createRawImage)),
      );
      return createIcoImage(planeImages);
    }
  }
  private getPlatform() {}

  async createArchive(imageBuffer: Buffer) {
    const archive = archiver('zip', { zlib: { level: 9 } });

    const outputStream = fs.createWriteStream('imgazilla.zip');
    archive.pipe(outputStream);

    archive.append(imageBuffer, { name: 'favicon.ico' });

    return new Promise((resolve, reject) => {
      outputStream.on('close', () => {
        fs.readFile('imgazilla.zip', (err, data) => {
          resolve(data);
        });
      });

      archive.on('error', (error) => {
        reject(error);
      });

      archive.finalize();
    });
  }

  private getHtml() {}
}
