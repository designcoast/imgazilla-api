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
    const isEnabledNotifications = await this.configService.get(
      'ENABLE_TELEGRAM_NOTIFICATION',
    );
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messageException = (
      exception instanceof HttpException ? exception.getResponse() : exception
    ) as any;

    let message = '';

    if (typeof messageException === 'string') {
      message = messageException;
    } else if (
      typeof messageException === 'object' &&
      messageException?.message
    ) {
      message = Array.isArray(messageException.message)
        ? messageException.message.join(', ')
        : messageException.message;
    }

    const errorMessage = `HTTP Status: ${status}, Error Message: ${message}, Endpoint: ${request.url}`;

    this.logger.error(errorMessage);

    if (!Boolean(isEnabledNotifications)) {
      await this.signalLoggerService.error(errorMessage);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
