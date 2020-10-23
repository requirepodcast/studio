import express from 'express';
import linksService from '../services/links.service';
import { protectedApiRoute } from '../utils/auth';

const router = express.Router();

router.get('/', protectedApiRoute, (req, res) => {
  linksService.getAll().then(links => {
    res.json(links);
  });
});

export default router;
