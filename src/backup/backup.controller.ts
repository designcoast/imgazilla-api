import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Response } from 'express';
import { BackupService } from '~/backup/backup.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SecretKeyGuard } from '~/guards/secretKey.guard';

@Controller('backup')
export class BackupController {
  private readonly logger = new Logger(BackupService.name);
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  async createBackup(@Res() res: Response) {
    try {
      await this.backupService.createBackup();

      return res.json().status(200);
    } catch (error) {
      this.logger.error('Backup creation failed', error?.stack);
      throw new HttpException(
        'Backup creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('restore')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(SecretKeyGuard)
  async restoreBackup(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.backupService.restoreBackup(file);
      return {
        message: 'Backup restored successfully',
        result,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to restore backup: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
