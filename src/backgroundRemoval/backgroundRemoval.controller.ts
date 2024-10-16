import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BackgroundRemovalService } from '~/backgroundRemoval/backgroundRemoval.service';
import { AccountService } from '~/account/account.service';
import { DecryptHeader } from '~/decorators/decryptHeader';
import { YupValidationPipe } from '~/pipes/yup-validation.pipe';
import {
  BackgroundRemovalDto,
  backgroundRemovalSchema,
} from '~/backgroundRemoval/dto/remove-background.dto';
import { ImageOptimizationResult } from '~/types';

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
  ): Promise<{ jobId: string }> {
    await this.accountService.checkAccountCredits(figmaID);

    return await this.backgroundRemovalService.getBackgroundRemovalProcessId(
      data,
      {
        figmaID,
      },
    );
  }

  @Get(':id/status')
  async getBackgroundRemovalStatus(@Param('id') id: string): Promise<{
    status: number;
    reason?: string;
  }> {
    return await this.backgroundRemovalService.getBackgroundRemovalStatus(id);
  }

  @Get(':id/result')
  async getBackgroundRemovalResult(
    @DecryptHeader() figmaID: string,
    @Param('id') id: string,
  ): Promise<{
    status: number;
    reason?: string;
    result?: Buffer | null;
  }> {
    return await this.backgroundRemovalService.getBackgroundRemovalResult(
      id,
      figmaID,
    );
  }
}
