import express, { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  prisma.user
    .findUnique({
      where: {
        id: req.body.user
      }
    })
    .then((account) => {
      console.log({
        username: account?.username,
        email: account?.email,
        firstName: account?.firstName,
        lastName: account?.lastName,
        id: account?.id
      });
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

export default router;
