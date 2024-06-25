import { Context, Next } from 'koa';
import jsonwebtoken from 'jsonwebtoken';
import { ENV } from '../constants/env.js';

export const authPassword = (psd: string) => async (ctx: Context, next: Next) => {
  if (ctx.header.authorization !== psd) {
    ctx.status = 401;
    ctx.body = { code: 401, message: 'Unauthorized' };
    return;
  } else {
    await next();
  }
};

type UserLick = {
  id: string | number;
};

export const authJwt = (verify: (user: UserLick) => boolean | PromiseLike<boolean>, secret = ENV.JWT_SECRET) => {
  return async (ctx: Context, next: Next) => {
    try {
      if (!ctx.header.authorization) throw new Error('No authorization header');
      const user: UserLick = jsonwebtoken.verify(ctx.header.authorization, secret) as UserLick;

      if (!verify(user)) throw new Error('Unauthorized');

      ctx.state.user = user;
    } catch (error) {
      ctx.status = 401;
      ctx.body = { code: 401, message: 'Unauthorized' };
      return;
    }

    await next();
  };
};

// self authJwt example
// export const authSelfJwt = authJwt(async (user) => Boolean(await redis.get(user.id)));
