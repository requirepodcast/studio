import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Socket } from 'socket.io';

dotenv.config();

const acceptedUsers: Array<string> = JSON.parse(process.env.ACCEPTED_IDs);

export function protectedAppRoute(req: Request, res: Response, next: NextFunction) {
  isAuthenticated(req.cookies.auth)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => res.redirect('/login'));
}

export function protectedApiRoute(req: Request, res: Response, next: NextFunction) {
  if (req.headers['access-token'] && req.headers['access-token'] === process.env.ACCESS_TOKEN) {
    req.user = {
      id: 0,
      name: 'Anonymous user',
      email: 'require@podcast.gq',
    };
    next();
  } else {
    isAuthenticated(req.cookies.auth)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(() => res.status(401).json({ message: 'User not authenticated' }));
  }
}

export function isAuthenticated(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err: Error, data: any) => {
      if (err) {
        reject(false);
      } else {
        if (acceptedUsers.includes(data.id)) {
          resolve(data);
        } else {
          reject(false);
        }
      }
    });
  });
}

export function protectedWebsocket(socket: Socket, next: Function) {
  isAuthenticated(socket.handshake.query.token)
    .then(() => next())
    .catch(() => next(new Error('Invalid credentials')));
}
