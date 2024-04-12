import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import koaStatic from 'koa-static';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'reflect-metadata';
import logger from './common/logger.js';
import { ENV } from './constants/env.js';
import { routerSetup } from './core/defineRouter.js';
import { router } from './services/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__dirname = __dirname;
global.__filename = __filename;

const app = new koa({ proxy: true });
app.on('error', (err) => {
  console.error(err);
});

async function bootstrap() {
  await routerSetup();

  logger.info('Starting server...');

  app.use(mount('/files', koaStatic(path.resolve(__dirname, '../public'))));
  app.use(bodyParser());

  app.use(router.routes());

  app.listen({ port: ENV.APP_PORT }, () => {
    logger.info(`Server ready at ${ENV.APP_HOST}:${ENV.APP_PORT}`);
  });
}

bootstrap();
