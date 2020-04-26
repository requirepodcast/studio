import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

export default router;
