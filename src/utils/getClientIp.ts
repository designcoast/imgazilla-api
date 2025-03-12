import { Request } from 'express';

export const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return request.socket.remoteAddress?.replace(/^::ffff:/, '') || 'Unknown';
};
