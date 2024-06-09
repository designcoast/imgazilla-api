import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { ConfigService } from '@nestjs/config';
// import { verifySignature } from '~/utils/verifySignature.utils';

@Injectable()
export class HeadersGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const request = context.switchToHttp().getRequest();
    //
    // const figmaHeader = request.headers['x-figma-signature'];
    // console.log('figmaHeader', figmaHeader);
    // const figmaRequestsSecret = this.configService.get('REQUESTS_SECRET_KEY');
    // const isFigmaHeaderVerified = verifySignature(
    //   request,
    //   figmaHeader,
    //   figmaRequestsSecret,
    // );
    // console.log('isFigmaHeaderVerified', isFigmaHeaderVerified);
    // const signatureHeader = request.headers['X-Signature'];
    //
    // const hmac = crypto.createHmac(
    //   'sha256',
    //   this.configService.get('LEMONSQUEEZY_WEBHOOK_SECRET'),
    // );
    //
    // const digest = Buffer.from(
    //   hmac.update(request.rawBody).digest('hex'),
    //   'utf8',
    // );
    // const signature = Buffer.from(signatureHeader || '', 'utf8');
    //
    // const isSignatureHeaderAllowed = crypto.timingSafeEqual(digest, signature);

    // if (!requiredHeader || requiredHeader !== 'expected-value') {
    //   throw new ForbiddenException('Forbidden');
    // }

    return true;
  }
}
