import express from 'express';
import passport from 'passport';
import { protectedAppRoute } from '../utils/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user'], session: false }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // @ts-ignore
    res.cookie('auth', req.user.token, { expires: 2147483647 }).redirect('/');
  },
);

router.get('/logout', protectedAppRoute, (req, res) => {
  return res.clearCookie('auth').redirect('/login');
});

export default router;
