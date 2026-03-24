import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

export function FakeAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  req.user = {
    id: 1,
    username: 'admin_user',
    role: 'admin', // Change to 'user' to test RBAC
  };
  next();
}
