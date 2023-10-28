import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validator';

const router = express.Router();

const organizationContentValidator = [
  body('name').exists().isString().isLength({ min: 1, max: 255 })
];

router.get('/', (req: Request, res: Response) => {
  prisma.userOrganization
    .findMany({
      where: { userId: +req.body.user },
      include: { organization: true }
    })
    .then((organizations) => {
      res.json(organizations);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

router.post(
  '/',
  organizationContentValidator,
  validate,
  (req: Request, res: Response) => {
    const { name } = req.body;

    prisma.organization
      .create({
        data: {
          name,
          creatorId: req.body.user
        }
      })
      .then((organization) => {
        res.json(organization);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.put(
  '/:id',
  organizationContentValidator,
  validate,
  (req: Request, res: Response) => {
    const { name } = req.body;

    prisma.organization
      .update({
        where: {
          id: +req.params.id
        },
        data: {
          name
        }
      })
      .then((organization) => {
        res.json(organization);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.delete('/:id', (req: Request, res: Response) => {
  prisma.organization
    .delete({
      where: {
        id: +req.params.id
      }
    })
    .then((organization) => {
      res.json(organization);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

export default router;
