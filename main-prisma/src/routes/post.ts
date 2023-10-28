import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validatorMiddleware';
import upload from '../../multer/upload';
import { schoolClassExists } from '../middleware/existsMiddleware';

const router = express.Router();

router.get('/class/:classId/student', (req: Request, res: Response) => {
	prisma.post
		.findMany({
			where: {
				schoolClassId: +req.params.classId
			},
			include: {
				attachments: true,
				comments: true
			}
		})
		.then((posts) => {
			res.json(posts);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
});

router.get(
	'/organization/:organizationId/student',
	(req: Request, res: Response) => {
		prisma.post
			.findMany({
				where: {
					organizationId: +req.params.organizationId
				},
				include: {
					attachments: true,
					comments: true
				}
			})
			.then((posts) => {
				res.json(posts);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

const createPostValidator = [
	body('title').exists().isString().isLength({ min: 1, max: 255 }),
	body('body').exists().isString().isLength({ min: 1 }),
	body('type').exists().isIn(['announcement', 'assignment'])
];

router.post(
	'/:classId',
	createPostValidator,
	validate,
	schoolClassExists,
	upload.array('attachments', 5),
	(req: Request, res: Response) => {
		const { title, body, type, schoolClass } = req.body;

		prisma.post
			.create({
				data: {
					body,
					title,
					type,
					schoolClassId: schoolClass.id,
					organizationId: schoolClass.organizationId,
					attachments: {
						create:
							(req.files as Array<any>)?.map((file) => ({
								filepath: file.path,
								filename: file.filename
							})) || []
					}
				},
				include: {
					attachments: true
				}
			})
			.then((post) => {
				res.json(post);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

const updatePostValidator = [
	body('title').exists().isString().isLength({ min: 1, max: 255 }),
	body('body').exists().isString().isLength({ min: 1 })
];

router.put(
	'/:id',
	updatePostValidator,
	validate,
	(req: Request, res: Response) => {
		const { title, body } = req.body;

		prisma.post
			.update({
				where: {
					id: +req.params.id
				},
				data: {
					title,
					body
				}
			})
			.then((post) => {
				res.json(post);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

router.delete('/:id', (req: Request, res: Response) => {
	prisma.post
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((post) => {
			res.json(post);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
});

export default router;
