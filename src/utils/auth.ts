import { NextFunction, Request, Response } from 'express';

export function protectedAppRoute(req: Request, res: Response, next: NextFunction) {
  return req.isAuthenticated() ? next() : res.redirect('/login');
}

export function protectedApiRoute(req: Request, res: Response, next: NextFunction) {
  return req.isAuthenticated() ? next() : res.status(401).json({ error: 'Not authenticated' });
}
