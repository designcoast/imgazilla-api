import { Injectable } from '@nestjs/common';
import { SignalAlertService } from '~/signal-alert/signal-alert.service';

@Injectable()
export class SignalLoggerService {
  constructor(private readonly signalAlertService: SignalAlertService) {}

  async log(message: string) {
    await this.signalAlertService.sendAlert(`LOG: ${message}`);
  }

  async error(message: string) {
    await this.signalAlertService.sendAlert(`ERROR: ${message}`);
  }

  async warn(message: string) {
    await this.signalAlertService.sendAlert(`WARN: ${message}`);
  }

  async debug(message: string) {
    await this.signalAlertService.sendAlert(`DEBUG: ${message}`);
  }

  async verbose(message: string) {
    await this.signalAlertService.sendAlert(`VERBOSE: ${message}`);
  }
}
