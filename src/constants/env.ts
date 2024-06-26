import { config } from 'dotenv';

let appHost = process.env.APP_HOST ?? 'http://127.0.0.1';

if (!appHost.startsWith('http')) {
  appHost = `https://${appHost}`;
}

config();

export const ENV = {
  APP_HOST: appHost,
  APP_PORT: +(process.env.APP_PORT ?? 10001),
  FILE_UPLOAD_SIZE: +(process.env.FILE_UPLOAD_SIZE ?? 10000000),

  // Auth
  SERVER_AUTH_PASSWORD: process.env.SERVER_AUTH_PASSWORD ?? 'esm-server-template',
  JWT_SECRET: process.env.JWT_SECRET ?? 'esm-server-template',
};
