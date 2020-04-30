import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import { protectedApiRoute } from '../utils/auth';
import RendererService from '../services/rendererService';

const router = express.Router();

router.get('/', protectedApiRoute, (req, res) =>
  res.json({ message: `requirepodcast's render server api` }),
);

router.post('/server/shutdown', protectedApiRoute, (req, res) => {
  res.json({ message: `Server is restarting...` });
  process.exit(0);
});

router.post(
  '/renderer/start',
  protectedApiRoute,
  [check('title').exists()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: `Didn't pass episode title` });
    }

    try {
      RendererService.startRendering(req.body.title);
    } catch (err) {
      return res.status(409).json({ error: err });
    }

    return res.status(202).json({ message: 'Started rendering' });
  },
);

router.post('/renderer/uploadAudio', protectedApiRoute, (req, res) => {});

export default router;
