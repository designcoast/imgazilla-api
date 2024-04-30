import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  GenerateFaviconOptionsDto,
  generateFaviconOptionsSchema,
} from './dto/generate-favicon.dto';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import { FaviconService } from './favicon.service';

@Controller('favicon')
export class FaviconController {
  constructor(private readonly faviconService: FaviconService) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('image'))
  async generateFavicon(
    @UploadedFile() image: Express.Multer.File,
    @Body(new YupValidationPipe(generateFaviconOptionsSchema))
    options: GenerateFaviconOptionsDto,
  ): Promise<
    {
      name: string;
      buffer: Uint8Array;
    }[]
  > {
    try {
      return await this.faviconService.generateFavicon(image.buffer, options);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
