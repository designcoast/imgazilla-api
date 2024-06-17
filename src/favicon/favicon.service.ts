import { extname } from 'path';
import { Injectable, Logger } from '@nestjs/common';

import * as sharp from 'sharp';

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
import { getIconOptions } from '~/configs/icon.config';
import { stringToBoolean } from '~/utils/stringToBoolean.utils';
import { decode } from 'base64-arraybuffer';
import { AccountService } from '~/account/account.service';
import { ConfigService } from '@nestjs/config';
import { FAVICON_ENTITY_TYPE } from '~/constants';

export interface ISourceSet {
  imgBuffer: Buffer;
  metadata: sharp.Metadata;
}

@Injectable()
export class FaviconService {
  private readonly logger = new Logger(FaviconService.name);

  constructor(
    private readonly accountService: AccountService,
    private configService: ConfigService,
  ) {}

  async generateFavicon(
    imageOptions: GenerateFaviconOptionsDto,
  ): Promise<IFaviconImages[]> {
    const { image, platforms } = imageOptions;

    const imageBuffer = Buffer.from(decode(image));

    const source = {
      imgBuffer: imageBuffer,
      metadata: await sharp(imageBuffer).metadata(),
    };

    const responses = [];

    const selectedPlatforms = Object.keys(platforms).filter((key) =>
      stringToBoolean(platforms[key]),
    );

    for (const platform of selectedPlatforms) {
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

  async updateCredits(figmaUserID: string): Promise<void> {
    this.logger.log(`Update amount of credits for ${figmaUserID} account`);

    const faviconCreditsCost = this.configService.get(
      'FAVICON_ARCHIVE_CREDITS_COST',
    );

    const account =
      await this.accountService.findAccountByFigmaUserId(figmaUserID);

    if (!account) {
      this.logger.log(`Account not found ${figmaUserID}`);
    }

    const currentCredits = parseInt(account.credits);
    const imageCredits = parseInt(faviconCreditsCost);
    const credits = (currentCredits - imageCredits).toString();

    await this.accountService.updateAccountCredits({
      figmaUserID,
      credits,
    });
  }

  async checkCredits(figmaUserID: string): Promise<void> {
    this.logger.log(`Check credits for ${figmaUserID} account`);

    await this.accountService.checkAccountCredits(
      figmaUserID,
      FAVICON_ENTITY_TYPE,
    );
  }
}
