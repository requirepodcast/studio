import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import linksService from '../services/links.service';
import { protectedApiRoute } from '../utils/auth';

const router = express.Router();

router.get('/', protectedApiRoute, (req, res) => {
  return linksService
    .getAll()
    .then(links => res.json(links.map(link => link.data)))
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/:slug', protectedApiRoute, (req, res) => {
  return linksService
    .get(req.params.slug)
    .then(link => res.json(link.data))
    .catch(err => res.status(500).json(err));
});

router.post(
  '/',
  protectedApiRoute,
  [check('slug').exists(), check('destination').exists()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: `Invalid arguments`, errors });
    }

    return linksService
      .create(req.body.slug, req.body.destination)
      .then(() => res.status(201).json({ message: 'Success' }))
      .catch(err => res.status(500).json(err));
  },
);

router.delete('/:slug', protectedApiRoute, (req, res) => {
  return linksService
    .delete(req.params.slug)
    .then(ret => {
      return res.status(200).json({ message: 'Deleted' });
    })
    .catch(err => res.status(500).json(err));
});

router.delete('/', protectedApiRoute, [check('links').isArray()], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: `Invalid arguments`, errors });
  }

  const links: string[] = req.body.links;

  return Promise.all(links.map((link: string) => linksService.delete(link)))
    .then(() => res.json({ message: 'Deleted' }))
    .catch(err => res.status(500).json(err));
});

export default router;
