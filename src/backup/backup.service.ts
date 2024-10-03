import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { spawn } from 'child_process';
import * as archiver from 'archiver';
import { Readable } from 'stream';

import { SignalAlertService } from '~/signal-alert/signal-alert.service';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  constructor(private readonly signalAlertService: SignalAlertService) {}

  @Cron('0 0 */3 * *') // Every three days at midnight
  async handleCron() {
    this.logger.log('Running scheduled backup task');
    await this.signalAlertService.sendAlert('Running scheduled backup task');
    await this.createBackup();
  }

  async createBackup(): Promise<void> {
    try {
      const backupStream = await this.performBackup();
      await this.signalAlertService.sendDocument(backupStream);
    } catch (error) {
      this.logger.error('Backup and send failed', error.stack);
      // Optionally notify via Telegram
    }
  }

  async performBackup(): Promise<Readable> {
    return new Promise((resolve, reject) => {
      const args = [
        '-U',
        process.env.POSTGRES_DATABASE_USER,
        '-h',
        process.env.POSTGRES_DATABASE_HOST,
        '-p',
        process.env.POSTGRES_DATABASE_PORT,
        process.env.POSTGRES_DATABASE_NAME,
      ];

      process.env.PGPASSWORD = process.env.POSTGRES_DATABASE_PASSWORD;

      //This line is used for testing only for the macos environment
      // const pgDump = spawn('/opt/homebrew/opt/libpq/bin/pg_dump', args);
      const pgDump = spawn('pg_dump', args);

      pgDump.on('error', (error) => {
        this.logger.error('Failed to start pg_dump', error);
        reject(error);
      });

      let errorOutput = '';
      pgDump.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pgDump.on('close', (code) => {
        if (code !== 0) {
          const error = new Error(
            `pg_dump exited with code ${code}: ${errorOutput}`,
          );
          this.logger.error(error.message);
          reject(error);
        }
      });

      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      archive.on('error', (err) => {
        this.logger.error('Archiver error', err);
        reject(err);
      });

      archive.append(pgDump.stdout, { name: 'backup.sql' });
      archive.finalize();

      resolve(archive);
    });
  }
}
