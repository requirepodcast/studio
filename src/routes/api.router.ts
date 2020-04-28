import express, { Request, Response } from 'express';
import multer from 'multer';
import { protectedApiRoute } from '../utils/auth';

const router = express.Router();

router.get('/', protectedApiRoute, (req, res) =>
  res.json({ message: `requirepodcast's render server api` }),
);

router.post('/server/shutdown', protectedApiRoute, (req, res) => {
  res.json({ message: `Server is restarting...` });
  process.exit(0);
});

export default router;
