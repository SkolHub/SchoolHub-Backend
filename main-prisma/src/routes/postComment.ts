import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validator';

const router = express.Router();

router.get('/:postId', (req: Request, res: Response) => {
  prisma.postComment
    .findMany({
      where: {
        postId: +req.params.postId
      }
    })
    .then((comments) => {
      res.json(comments);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

const postCommentContentValidator = [
  body('body').exists().isString().isLength({ min: 1 })
];

router.post(
  '/:postId',
  postCommentContentValidator,
  validate,
  (req: Request, res: Response) => {
    const { body } = req.body;

    prisma.postComment
      .create({
        data: {
          body,
          userId: +req.body.user,
          postId: +req.params.postId
        }
      })
      .then((comment) => {
        res.json(comment);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.put(
  '/:id',
  postCommentContentValidator,
  validate,
  (req: Request, res: Response) => {
    const { body } = req.body;

    prisma.postComment
      .update({
        where: {
          id: +req.params.id
        },
        data: {
          body
        }
      })
      .then((comment) => {
        res.json(comment);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.delete('/:id', (req: Request, res: Response) => {
  prisma.postComment
    .delete({
      where: {
        id: +req.params.id
      }
    })
    .then((comment) => {
      res.json(comment);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

export default router;
