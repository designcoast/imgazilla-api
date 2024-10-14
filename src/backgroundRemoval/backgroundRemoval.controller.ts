import { Body, Controller, Post } from '@nestjs/common';
import { BackgroundRemovalService } from '~/backgroundRemoval/backgroundRemoval.service';
import { AccountService } from '~/account/account.service';
import { DecryptHeader } from '~/decorators/decryptHeader';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import {
  BackgroundRemovalDto,
  backgroundRemovalSchema,
} from '~/backgroundRemoval/dto/remove-background.dto';

@Controller('background-removal')
export class BackgroundRemovalController {
  constructor(
    private readonly backgroundRemovalService: BackgroundRemovalService,
    private readonly accountService: AccountService,
  ) {}
  @Post('remove')
  async removeBackground(
    @DecryptHeader() figmaID: string,
    @Body(new YupValidationPipe(backgroundRemovalSchema))
    data: BackgroundRemovalDto,
  ) {
    const imageBuffer = Buffer.from(data.image, 'base64');
    return await this.backgroundRemovalService.removeImageBackground(
      imageBuffer,
    );
  }
}
