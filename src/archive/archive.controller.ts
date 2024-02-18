import { Controller, Post } from '@nestjs/common';

@Controller('archive')
export class ArchiveController {
  constructor() {}

  @Post('create')
  async createArchive(): Promise<any> {}
}
