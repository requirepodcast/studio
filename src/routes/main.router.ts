import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  return req.isAuthenticated()
    ? res.render('index.pug', { title: 'index' })
    : res.redirect('/login');
});

router.get('/login', (req, res) => {
  return req.isAuthenticated() ? res.redirect('/') : res.render('login.pug', { title: 'login' });
});

export default router;
