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
    jwt.verify(req.user.token, process.env.JWT_KEY, (err, data) => console.log(data));
    // @ts-ignore
    res.cookie('auth', req.user.token, { expires: new Date(Date.now() + 900000) }).redirect('/');
  },
);

router.get('/logout', protectedAppRoute, (req, res) => {
  return res.clearCookie('auth').redirect('/login');
});

export default router;
