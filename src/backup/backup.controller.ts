import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from '~/backup/backup.service';
import { Readable } from 'stream';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  async createBackup(@Res() res: Response) {
    try {
      const backupStream = await this.backupService.performBackup();

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="backup_${new Date()
          .toISOString()
          .replace(/[:.]/g, '-')}.zip"`,
      });

      (backupStream as Readable).pipe(res);
    } catch (error) {
      throw new HttpException(
        'Backup creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
