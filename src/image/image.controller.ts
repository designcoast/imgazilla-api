import { Body, Controller, Post } from '@nestjs/common';
import { ImageService } from '~/image/image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('optimize')
  // @UseInterceptors(FileInterceptor('image'))
  async optimizeImage(
    // @UploadedFile() image: Express.Multer.File,
    @Body() image: any,
    // options: IImageOptimizationOptions,
  ) {
    await this.imageService.optimizeImage(image);
  }
}
