import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import koaStatic from 'koa-static';
import path, { dirname } from 'node:path';
import 'reflect-metadata';
import logger from './common/logger.js';
import { ENV } from './constants/env.js';
import { setupRouter } from './services/router.js';
import { restful } from './middlewares/restful.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__dirname = __dirname;
global.__filename = __filename;

const app = new koa({ proxy: true });
app.on('error', (err) => {
  console.error(err);
});

async function bootstrap() {
  logger.info('Starting server...');

  app.use(mount('/files', koaStatic(path.resolve(__dirname, '../public'))));
  app.use(bodyParser());

  await setupRouter(app);
  app.use(restful);

  app.listen({ port: ENV.APP_PORT }, () => {
    logger.info(`Server ready at ${ENV.APP_HOST}:${ENV.APP_PORT}`);
  });
}

bootstrap();
