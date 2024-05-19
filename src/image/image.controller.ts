import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from '~/image/image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import { imageOptimizationSchema } from '~/image/dto/optimaze-image.dto';
import { IImageOptimizationOptions } from '~/types';

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
    console.log('image', image);
    // return await this.imageService.optimizeImage(image.buffer, options);
  }
}
