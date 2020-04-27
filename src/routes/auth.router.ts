import express from 'express';
import passport from 'passport';
import { protectedAppRoute } from '../utils/auth';

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

router.get('/logout', protectedAppRoute, (req, res) => {
  req.logout();
  return res.redirect('/login');
});

export default router;
