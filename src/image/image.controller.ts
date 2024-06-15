import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { ImageService } from '~/image/image.service';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import {
  ImageOptimizationDto,
  imageOptimizationSchema,
} from '~/image/dto/optimaze-image.dto';
import { ImageOptimizationResult } from '~/types';
import { DecryptHeader } from '~/decorators/decryptHeader';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('optimize')
  async optimizeImage(
    @DecryptHeader() figmaID: string,
    @Body(new YupValidationPipe(imageOptimizationSchema))
    image: ImageOptimizationDto[],
  ): Promise<{ jobId: string }> {
    return await this.imageService.optimizeImage(image, {
      figmaID,
    });
  }

  @Get(':id/status')
  async getImageStatus(@Param('id') id: string): Promise<{
    status: number;
    reason?: string;
  }> {
    return await this.imageService.getImageStatus(id);
  }

  @Get(':id/result')
  async getImageOptimizationResult(
    @DecryptHeader() figmaID: string,
    @Param('id') id: string,
  ): Promise<{
    status: number;
    reason?: string;
    result?: ImageOptimizationResult[];
  }> {
    return await this.imageService.getImageOptimizationResult(id, figmaID);
  }
}
