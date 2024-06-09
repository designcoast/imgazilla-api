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
    const signatureHeader = request.headers['s-signature'];

    if (!figmaHeader || signatureHeader) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
