import { Context, Next } from 'koa';

export const psdAuth = (psd: string) => async (ctx: Context, next: Next) => {
  if (ctx.header.authorization !== psd) {
    ctx.status = 401;
    ctx.body = { code: 401, message: 'Unauthorized' };
    return;
  } else {
    await next();
  }
};
