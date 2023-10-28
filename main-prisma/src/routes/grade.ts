import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validatorMiddleware';
import { schoolClassExists } from '../middleware/existsMiddleware';

const router = express.Router();

router.get('/class/:classId/student', (req: Request, res: Response) => {
	prisma.grade
		.findMany({
			where: {
				schoolClassId: +req.params.classId,
				userId: req.body.user
			}
		})
		.then((grades) => {
			res.json(grades);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
});

router.get(
	'/organization/:organizationId/student',
	(req: Request, res: Response) => {
		prisma.grade
			.findMany({
				where: {
					organizationId: +req.params.organizationId
				}
			})
			.then((grades) => {
				res.json(grades);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

const createGradeValidator = [
	body('value').exists().isString().isLength({ min: 1, max: 255 }),
	body('date').exists().isDate(),
	body('User').exists().isInt()
];

router.post(
	'/:classId',
	createGradeValidator,
	validate,
	schoolClassExists,
	(req: Request, res: Response) => {
		const { date, value, user, schoolClass } = req.body;

		prisma.grade
			.create({
				data: {
					date,
					value,
					userId: user,
					schoolClassId: schoolClass.id,
					organizationId: schoolClass.organizationId
				}
			})
			.then((grade) => {
				res.json(grade);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

const updateGradeValidator = [
	body('value').exists().isString().isLength({ min: 1, max: 255 }),
	body('date').exists().isDate()
];

router.put(
	'/:id',
	updateGradeValidator,
	validate,
	(req: Request, res: Response) => {
		const { date, value } = req.body;

		prisma.grade
			.update({
				where: {
					id: +req.params.id
				},
				data: {
					date,
					value
				}
			})
			.then((grade) => {
				res.json(grade);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

router.delete('/:id', (req: Request, res: Response) => {
	prisma.grade
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((grade) => {
			res.json(grade);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
});

export default router;
