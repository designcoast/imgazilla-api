import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Express } from 'express';

import { spawn, exec } from 'child_process';
import * as archiver from 'archiver';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import { promisify } from 'util';

import { SignalAlertService } from '~/signal-alert/signal-alert.service';
import { join } from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private dbConfig = {
    host: process.env.POSTGRES_DATABASE_HOST,
    port: process.env.POSTGRES_DATABASE_PORT,
    username: process.env.POSTGRES_DATABASE_USER,
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    database: process.env.POSTGRES_DATABASE_NAME,
  };

  private backupDirectory = join(__dirname, '..', 'backups');
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

  async restoreBackup(file: Express.Multer.File): Promise<string> {
    const filePath = join(this.backupDirectory, file.originalname);

    // Save the uploaded file locally
    try {
      await fs.writeFile(filePath, file.buffer);
    } catch (error) {
      this.logger.error('Failed to save uploaded file', error);
      throw new HttpException(
        'Failed to save uploaded file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Restore the backup
    const restoreCommand = this.getRestoreCommand(filePath);

    try {
      const { stdout, stderr } = await execAsync(restoreCommand);
      if (stderr) {
        throw new Error(stderr);
      }
      this.logger.log(`Backup restored successfully from ${file.originalname}`);
      return stdout;
    } catch (error) {
      this.logger.error('Error restoring backup', error);
      throw new HttpException(
        'Failed to restore backup',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getRestoreCommand(filePath: string): string {
    const { host, port, username, password, database } = this.dbConfig;

    process.env.PGPASSWORD = process.env.POSTGRES_DATABASE_PASSWORD;

    if (filePath.endsWith('.sql')) {
      return `PGPASSWORD=${password} psql -h ${host} -p ${port} -U ${username} -d ${database} -f "${filePath}"`;
    } else if (filePath.endsWith('.tar') || filePath.endsWith('.gz')) {
      return `PGPASSWORD=${password} pg_restore -h ${host} -p ${port} -U ${username} -d ${database} "${filePath}"`;
    } else {
      throw new HttpException(
        'Unsupported backup format',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
