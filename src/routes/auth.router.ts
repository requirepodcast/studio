import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user'] }));

router.get('/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

export default router;
