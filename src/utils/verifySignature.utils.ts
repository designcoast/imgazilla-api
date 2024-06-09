import { RawBodyRequest, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export const verifySignature = (
  request: RawBodyRequest<Request>,
  signatureHeader: string,
  secret: string,
) => {
  try {
    const hmac = crypto.createHmac('sha256', secret);

    const digest = Buffer.from(
      hmac.update(request.rawBody).digest('hex'),
      'utf8',
    );
    const signature = Buffer.from(signatureHeader || '', 'utf8');

    return crypto.timingSafeEqual(digest, signature);
  } catch (e) {
    const logger = new Logger(verifySignature.name);
    logger.error(e);
  }
};
