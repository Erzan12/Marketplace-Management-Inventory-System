import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from '../types/request-user.interface';

export const SessionUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    //need to augment the Express Request interface globally.
    //the use of use of PassportStrategy does inject the user onto the request object, but TypeScript doesn’t automatically know that because the base express.Request type doesn't include a user property
    //TypeScript will know that request.user exists and conforms to your RequestUser type — no more ts(2339) errors.
    return request.user as RequestUser;
  },
);