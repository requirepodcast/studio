import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import { protectedApiRoute } from '../utils/auth';
import RendererService from '../services/rendererService';
import fs from 'fs-extra';
import prettyBytes from 'pretty-bytes';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage: storage });

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
  [check('title').exists(), check('audioFile').exists(), check('outputFile').exists()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: `Invalid arguments`, errors });
    }

    try {
      RendererService.startRendering(req.body.title, req.body.audioFile, req.body.outputFile);
    } catch (err) {
      return res.status(409).json({ error: err });
    }

    return res.status(202).json({ message: 'Started rendering' });
  },
);

router.post('/audio/upload', protectedApiRoute, upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Did not uplaod any file' });
  }
  return res.json({ message: 'File successfully uploaded', filename: req.file.filename });
});

router.get('/audio', protectedApiRoute, (req, res) => {
  return fs.readdir('./public/uploads/').then(fileNames => {
    const files: any[] = [];
    fileNames.map(file => {
      files.push({ name: file, size: prettyBytes(fs.statSync(`./public/uploads/${file}`).size) });
    });
    res.json(files);
  });
});

router.get('/output', protectedApiRoute, (req, res) => {
  return fs.readdir('./public/output/').then(fileNames => {
    const files: any[] = [];
    fileNames.map(file => {
      files.push(`/static/output/${file}`);
    });
    res.json(files);
  });
});

export default router;
