import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Express } from 'express';

import { spawn, exec } from 'child_process';
import * as archiver from 'archiver';
import { Readable } from 'stream';
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
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.getRestoreCommandFromBuffer(file);

      this.logger.log(
        `Backup restored successfully from buffer (${file.originalname})`,
      );
      return `Backup restored successfully: ${file.originalname}`;
    } catch (error) {
      this.logger.error('Error restoring backup', error);
      throw new HttpException(
        'Failed to restore backup',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getRestoreCommandFromBuffer(
    file: Express.Multer.File,
  ): Promise<void> {
    const { host, port, username, password, database } = this.dbConfig;

    process.env.PGPASSWORD = password;

    if (file.originalname.endsWith('.sql')) {
      const restoreCommand = `echo "${file.buffer.toString()}" | psql -h ${host} -p ${port} -U ${username} -d ${database}`;
      await execAsync(restoreCommand);
    } else if (
      file.originalname.endsWith('.tar') ||
      file.originalname.endsWith('.gz')
    ) {
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
      const restoreProcess = spawn('pg_restore', args);

      const readable = new Readable();
      readable._read = () => {};
      readable.push(file.buffer);
      readable.push(null);

      readable.pipe(restoreProcess.stdin);

      return new Promise((resolve, reject) => {
        restoreProcess.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`pg_restore exited with code ${code}`));
          } else {
            resolve();
          }
        });
      });
    } else {
      throw new HttpException(
        'Unsupported backup format',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
