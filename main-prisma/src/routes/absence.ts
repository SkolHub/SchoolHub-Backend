import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validator';

const router = express.Router();

router.get('/class/:classId/student', (req: Request, res: Response) => {
  prisma.absence
    .findMany({
      where: {
        schoolClassId: +req.params.classId,
        userId: req.body.user
      }
    })
    .then((absences) => {
      res.json(absences);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

router.get(
  '/organization/:organizationId/student',
  (req: Request, res: Response) => {
    prisma.absence
      .findMany({
        where: {
          organizationId: +req.params.organizationId
        }
      })
      .then((absences) => {
        res.json(absences);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

const createAbsenceValidator = [
  body('date').exists().isDate(),
  body('user').exists().isInt()
];

router.post(
  '/:classId',
  createAbsenceValidator,
  validate,
  (req: Request, res: Response) => {
    const { date, user } = req.body;

    prisma.absence
      .findUnique({
        where: {
          id: +req.params.classId
        }
      })
      .then((schoolClass) => {
        if (!schoolClass)
          return res.status(404).json({ message: 'Class not found.' });

        prisma.absence
          .create({
            data: {
              date,
              excused: false,
              userId: user,
              schoolClassId: schoolClass.id,
              organizationId: schoolClass.organizationId
            }
          })
          .then((absence) => {
            res.json(absence);
          })
          .catch((e) => {
            res.status(500).json(e);
          });
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

const updateAbsenceValidator = [body('excused').exists().isBoolean()];

router.put(
  '/:id',
  updateAbsenceValidator,
  validate,
  (req: Request, res: Response) => {
    const { excused } = req.body;

    prisma.absence
      .update({
        where: {
          id: +req.params.id
        },
        data: {
          excused
        }
      })
      .then((absence) => {
        res.json(absence);
      })
      .catch((e) => {
        res.status(500).json(e);
      });
  }
);

router.delete('/:id', (req: Request, res: Response) => {
  prisma.absence
    .delete({
      where: {
        id: +req.params.id
      }
    })
    .then((absence) => {
      res.json(absence);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

export default router;
