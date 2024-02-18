import { Module } from '@nestjs/common';
import { ImageOptimisationController } from './image-optimisation.controller';

@Module({
  controllers: [ImageOptimisationController]
})
export class ImageOptimisationModule {}
