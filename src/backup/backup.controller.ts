import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from '~/backup/backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  async createBackup(@Res() res: Response) {
    try {
      await this.backupService.createBackup();

      return res.json().status(200);
    } catch (error) {
      throw new HttpException(
        'Backup creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
