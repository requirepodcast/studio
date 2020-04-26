import express from 'express';
const router = express.Router();

router.get('/', (req, res) =>
  res.send(`Welcome to requirepodcast render server ${JSON.stringify(req.user)}`),
);

export default router;
