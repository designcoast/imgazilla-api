import 'archiver';

declare module 'archiver' {
  interface CoreOptions {
    encryptionMethod?: 'aes256' | 'zip20' | undefined;
    password?: string | undefined;
  }
}
