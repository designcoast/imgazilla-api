import { Injectable, NestMiddleware } from '@nestjs/common';

import * as rawBody from 'raw-body';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  async use(req: Request | any, res: Response, next: NextFunction) {
    try {
      const contentLength = req.headers['content-length'];
      if (!contentLength) {
        throw new Error('Missing Content-Length header');
      }

      const rawwBody = await rawBody(req, {
        length: parseInt(contentLength, 10),
        limit: '10mb',
      });

      console.log('rawwBody', rawwBody);

      req.rawBody = rawwBody.toString(); // Convert buffer to string
      next();
    } catch (err) {
      next(err); // Pass error to error handling middleware
    }
  }
}
