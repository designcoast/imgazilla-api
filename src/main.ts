import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { ExceptionsFilter } from '~/filters/exceptions.filter';
import { SignalLoggerService } from '~/loggers/signal-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const signalLoggerService = app.get(SignalLoggerService);

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
