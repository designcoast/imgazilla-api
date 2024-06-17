import { Body, Controller, Post } from '@nestjs/common';
import {
  GenerateFaviconOptionsDto,
  generateFaviconOptionsSchema,
} from './dto/generate-favicon.dto';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import { FaviconService } from './favicon.service';
import { DecryptHeader } from '~/decorators/decryptHeader';

@Controller('favicon')
export class FaviconController {
  constructor(private readonly faviconService: FaviconService) {}

  @Post('generate')
  async generateFavicon(
    @DecryptHeader() figmaID: string,
    @Body(new YupValidationPipe(generateFaviconOptionsSchema))
    imageOptions: GenerateFaviconOptionsDto,
  ): Promise<
    {
      name: string;
      buffer: Uint8Array;
    }[]
  > {
    await this.faviconService.checkCredits(figmaID);

    await this.faviconService.updateCredits(figmaID);

    return await this.faviconService.generateFavicon(imageOptions);
  }
}
