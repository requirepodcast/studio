import express, { Request, Response } from 'express';
import multer from 'multer';
import { protectedApiRoute } from '../utils/auth';

const upload = multer({ dest: '../public/uploads' });
const router = express.Router();

router.get('/', protectedApiRoute, (req, res) =>
  res.json({ message: `requirepodcast's render server api` }),
);

router.post('/audio/upload', protectedApiRoute, upload.single('audioFile'), (req, res) => {
  console.log(req.file);
  return res.json({ message: 'kul' });
});

export default router;
