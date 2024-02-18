import { Module } from '@nestjs/common';
import { ArchiveController } from './archive.controller';

@Module({
  controllers: [ArchiveController]
})
export class ArchiveModule {}
