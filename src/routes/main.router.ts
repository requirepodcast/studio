import express from 'express';
import { protectedAppRoute } from '../utils/auth';
const router = express.Router();

router.get('/', protectedAppRoute, (req, res) => {
  return res.render('index.pug', { title: 'index' });
});

router.get('/login', (req, res) => {
  return req.isAuthenticated() ? res.redirect('/') : res.render('login.pug', { title: 'login' });
});

export default router;
