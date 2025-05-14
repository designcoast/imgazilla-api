import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class HeadersGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const figmaHeader = request.headers['x-figma-signature'];
    const signatureHeader = request.headers['x-signature'];
    const healthHeader = request.headers['x-health-check-guard'];
    // if (request.route.path.includes('backup')) {
    //   return true;
    // }

    if (healthHeader) {
      return true;
    }

    if (
      request.headers['user-agent'] === 'LemonSqueezy-Hookshot' &&
      signatureHeader
    ) {
      return true;
    }

    if (request.headers['user-agent'].includes('Figma') || figmaHeader) {
      return true;
    }

    throw new ForbiddenException('Forbidden');
  }
}
