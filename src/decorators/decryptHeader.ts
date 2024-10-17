import * as dotenv from 'dotenv';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decrypt } from '~/utils/decrypt.utils';

dotenv.config();

const secret = process.env.REQUESTS_SECRET_KEY;

export const DecryptHeader = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // const isDevelopmentEnv = process.env.NODE_ENV === 'development';

    const request = ctx.switchToHttp().getRequest();
    const encryptedValue = request.headers['x-figma-id'];

    if (!encryptedValue) {
      return null;
    }

    try {
      // if (isDevelopmentEnv) {
      //   return encryptedValue; // for development, return raw value for easier testing
      // }

      return decrypt(encryptedValue, secret);
    } catch (error) {
      throw new Error('Invalid encrypted value');
    }
  },
);
