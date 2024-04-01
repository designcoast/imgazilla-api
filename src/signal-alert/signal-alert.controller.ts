import { Body, Controller, HttpStatus, Post, Logger } from '@nestjs/common';
import { SignalAlertService } from '~/signal-alert/signal-alert.service';

@Controller('signal')
export class SignalAlertController {
  private readonly logger = new Logger(SignalAlertController.name);
  constructor(private readonly signalAlertService: SignalAlertService) {}

  @Post('notify')
  async notify(@Body() body: { message: string }) {
    try {
      await this.signalAlertService.logCriticalIssue(body.message);

      return {
        status: HttpStatus.OK,
      };
    } catch (err) {
      this.logger.log(err);

      return { status: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
