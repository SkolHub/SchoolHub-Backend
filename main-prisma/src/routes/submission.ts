import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validator';

const router = express.Router();

router.get('/:postId', (req: Request, res: Response) => {});

router.post('/:postId', (req: Request, res: Response) => {});

export default router;
