import express from 'express';
import { protectedAppRoute, isAuthenticated } from '../utils/auth';
const router = express.Router();

router.get('/', protectedAppRoute, (req, res) => {
  return res.render('index.pug', { title: 'index' });
});

router.get('/login', (req, res) => {
  isAuthenticated(req.cookies.auth)
    .then(() => res.redirect('/'))
    .catch(() => res.render('login.pug', { title: 'login' }));
});

export default router;
