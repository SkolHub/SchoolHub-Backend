import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validator';

const router = express.Router();

router.get('/:id', (req: Request, res: Response) => {});

export default router;
