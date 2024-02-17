import * as fs from 'fs';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';

import * as sharp from 'sharp';
import * as archiver from 'archiver';

import { GenerateFaviconOptionsDto } from './dto/generate-favicon.dto';
import {
  createIcoImage,
  createPlane,
  createPngImage,
  createRawImage,
  createSvgImage,
} from '~/utils/icons.utils';
import { IFaviconImages, IIconOptions } from '~/types';
import { getPlatformOptions } from '~/utils/platforms.utils';
import { getIconOptions } from '~/config/icon.config';

export interface ISourceSet {
  imgBuffer: Buffer;
  metadata: sharp.Metadata;
}

@Injectable()
export class FaviconService {
  async generateFavicon(
    imageBuffer: Buffer,
    options: GenerateFaviconOptionsDto,
  ): Promise<IFaviconImages[]> {
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

  private async createImages(
    source: ISourceSet,
    options: IIconOptions,
  ): Promise<IFaviconImages> {
    const props = getIconOptions(options);
    const ext = extname(options.name);

    if (ext === '.ico') {
      const planeImages = await Promise.all(
        props.map((prop) => createPlane(source, prop).then(createRawImage)),
      );
      const buffer = createIcoImage(planeImages);
      return { name: options.name, buffer };
    } else if (ext === '.svg') {
      const buffer = await createSvgImage(source, props[0]);
      return { name: options.name, buffer };
    } else {
      const buffer = await createPlane(source, props[0]).then(createPngImage);
      return { name: options.name, buffer };
    }
  }
  private getPlatform() {}

  async createArchive(faviconImages: IFaviconImages[]) {
    const archive = archiver('zip', { zlib: { level: 9 } });

    const outputStream = fs.createWriteStream('imgazilla.zip');
    archive.pipe(outputStream);

    for (const faviconImage of faviconImages) {
      archive.append(faviconImage.buffer, { name: faviconImage.name });
    }

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
