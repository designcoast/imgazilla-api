import { AES, enc } from 'crypto-js';

export const decrypt = (value: string, secret: string) => {
  const bytes = AES.decrypt(value, secret);
  return bytes.toString(enc.Utf8);
};
