import { INestApplication } from '@nestjs/common';

export function setupGlobalPrefix(app: INestApplication): void {
  const allowGlobalPrefix = process.env.ALLOW_GLOBAL_PREFIX !== 'no';
  const globalPrefix = allowGlobalPrefix
    ? (process.env.GLOBAL_PREFIX ?? '')
    : '';

  if (allowGlobalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }
}