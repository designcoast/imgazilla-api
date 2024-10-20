import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secretKeyHeader = request.headers['x-auth-key'];

    const expectedSecretKey = this.configService.get<string>('SECRET_AUTH_KEY');

    if (secretKeyHeader === expectedSecretKey) {
      return true;
    }

    throw new UnauthorizedException('Invalid secret key');
  }
}
