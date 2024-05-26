import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ImageService } from '~/image/image.service';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import {
  ImageOptimizationDto,
  imageOptimizationSchema,
} from '~/image/dto/optimaze-image.dto';
import { ImageOptimizationResult } from '~/types';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('optimize')
  async optimizeImage(
    @Body(new YupValidationPipe(imageOptimizationSchema))
    image: ImageOptimizationDto[],
  ): Promise<string> {
    return await this.imageService.optimizeImage(image);
  }

  @Get(':id/status')
  async getImageStatus(@Param('id') id: string): Promise<{
    status: number;
    reason?: string;
  }> {
    return await this.imageService.getImageStatus(id);
  }

  @Get(':id/result')
  async getImageOptimizationResult(@Param('id') id: string): Promise<{
    status: number;
    reason?: string;
    result?: ImageOptimizationResult;
  }> {
    return await this.imageService.getImageOptimizationResult(id);
  }
}
