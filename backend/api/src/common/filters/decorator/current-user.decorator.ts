import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { Student } from '../../../db/schema.js';

type RequestWithUser = Request & { user: Student };

export const CurrentUser = createParamDecorator(
  (data: keyof Student | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);