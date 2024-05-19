import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SignalLoggerService } from '~/loggers/signal-logger.service';
import { ConfigService } from '@nestjs/config';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);
  private readonly configService = new ConfigService();

  constructor(
    @Inject(SignalLoggerService)
    private readonly signalLoggerService: SignalLoggerService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (
      exception instanceof HttpException ? exception.getResponse() : exception
    ) as string;

    this.logger.error(`HTTP Status: ${status}, Error Message: ${message}`);
    const isEnabledNotifications = await this.configService.get(
      'ENABLE_TELEGRAM_NOTIFICATION',
    );

    if (isEnabledNotifications) {
      await this.signalLoggerService.error(message);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}
