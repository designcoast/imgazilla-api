import {
  Body,
  Controller,
  Post,
  Header,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
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
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename=imgazilla.zip')
  @UseInterceptors(FileInterceptor('image'))
  async generateFavicon(
    @UploadedFile() image: Express.Multer.File,
    @Body(new YupValidationPipe(generateFaviconOptionsSchema))
    options: GenerateFaviconOptionsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const faviconImages = await this.faviconService.generateFavicon(
        image.buffer,
        options,
      );

      // console.log('faviconImages', faviconImages);
      // return iconBuffer;
      const buffer = await this.faviconService.createArchive(faviconImages);
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
