import express from 'express';
import { protectedAppRoute, isAuthenticated } from '../utils/auth';
const router = express.Router();

router.get('/', protectedAppRoute, (req, res) => {
  // @ts-ignore
  return res.render('index.pug', { title: 'index', user: req.user });
});

router.get('/renderer', protectedAppRoute, (req, res) => {
  return res.render('renderer.pug', { title: 'episode renderer' });
});

router.get('/pig', protectedAppRoute, (req, res) => {
  return res.render('pig.pug', { title: 'promotional image generator' });
});

router.get('/login', (req, res) => {
  isAuthenticated(req.cookies.auth)
    .then(() => res.redirect('/'))
    .catch(() => res.render('login.pug', { title: 'login' }));
});

export default router;
