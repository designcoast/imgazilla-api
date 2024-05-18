import { Request, Response, NextFunction } from 'express';

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { ExceptionsFilter } from '~/filters/exceptions.filter';
import { SignalLoggerService } from '~/loggers/signal-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const signalLoggerService = app.get(SignalLoggerService);
  const logger = new Logger(AppModule.name);

  // Middleware to log request sizes
  app.use((req: Request, res: Response, next: NextFunction) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      const sizeInKB = Buffer.byteLength(data, 'utf8') / 1_000_000;
      if (sizeInKB === 0) return;
      logger.log(`Request size: ${sizeInKB.toFixed(2)} MB`);
    });
    next();
  });

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors();

  app.enableShutdownHooks();

  app.useGlobalFilters(new ExceptionsFilter(signalLoggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
