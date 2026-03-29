import { RequestUser } from './request-user.interface';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

export interface JwtPayload {
  id: string;
  tokenVersion: number;
  request_token: string;
}