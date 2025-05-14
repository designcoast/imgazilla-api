// import { Request, Response, NextFunction } from 'express';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { ExceptionsFilter } from '~/filters/exceptions.filter';
import { SignalLoggerService } from '~/loggers/signal-logger.service';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.enable('trust proxy');

  app.useStaticAssets(join(__dirname, '..', 'backups'));

  const signalLoggerService = app.get(SignalLoggerService);
  // const logger = new Logger(AppModule.name);

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  // Middleware to log request sizes
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   let data = '';
  //   req.on('data', (chunk) => {
  //     data += chunk;
  //   });
  //   req.on('end', () => {
  //     const sizeInKB = Buffer.byteLength(data, 'utf8') / 1_000_000;
  //     if (sizeInKB === 0) return;
  //     logger.log(`Request size: ${sizeInKB.toFixed(2)} MB`);
  //   });
  //   next();
  // });

  // app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors();

  app.enableShutdownHooks();

  app.useGlobalFilters(new ExceptionsFilter(signalLoggerService));

  // Configure express middleware for body size limits
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
  app.useBodyParser('raw', { type: '/' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(3000);
}

void bootstrap();
