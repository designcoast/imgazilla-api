import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from '~/image/image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('optimize')
  @UseInterceptors(FileInterceptor('image'))
  async optimizeImage(@UploadedFile() image: Express.Multer.File) {
    return await this.imageService.optimizeImage(image);
  }
}
