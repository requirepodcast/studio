import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: `requirepodcast's render server api` }));

export default router;
