import Koa, { Middleware } from 'koa';
import Router from 'koa-router';

export interface RouterOptions {
  prefix?: string;
  options?: Router.IRouterOptions;
  middleware?: Middleware[];
  setup?: () => Promise<void>;
  routes: Router[];
  health?: boolean;
}

const setups: Required<RouterOptions>['setup'][] = [];

export function defineRouter(options: RouterOptions) {
  const router = new Router({ prefix: options.prefix, ...options.options });

  if (options.health) {
    router.get('/health', (ctx) => (ctx.body = 'OK'));
  }

  if (options.middleware) {
    router.use(...options.middleware);
  }

  options.routes.forEach((route) => {
    router.use(route.routes());
  });

  if (options.setup) {
    setups.push(options.setup);
  }

  return router;
}

const router = defineRouter({
  prefix: '/api',
  health: true,
  routes: [],
});

export const setupRouter = async (app: Koa) => {
  for (const setup of setups) {
    await setup();
  }

  app.use(router.routes());
};
