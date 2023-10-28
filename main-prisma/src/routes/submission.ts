import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import upload from '../../multer/upload';
import { validate } from '../middleware/validatorMiddleware';
import { submissionExists } from '../middleware/existsMiddleware';

const router = express.Router();

router.get('/:postId', (req: Request, res: Response) => {
	prisma.submission
		.findFirst({
			where: {
				postId: +req.params.postId,
				userId: +req.body.user
			},
			include: {
				attachments: true
			}
		})
		.then((submission) => {
			res.json(submission);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
});

router.post(
	'/:postId',
	submissionExists,
	upload.single('attachment'),
	(req: Request, res: Response) => {
		const { submission } = req.body;

		prisma.submissionAttachment
			.create({
				data: {
					filename: req.file!.filename,
					filepath: req.file!.path,
					submissionId: submission.id
				}
			})
			.then((submissionAttachment) => {
				res.json(submissionAttachment);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

const schoolClassContentValidator = [body('submitted').exists().isBoolean()];

router.put(
	'/:postId/submit',
	schoolClassContentValidator,
    submissionExists,
	validate,
	(req: Request, res: Response) => {
		const { submitted, submission } = req.body;

		prisma.submission
			.update({
				data: {
					submitted,
					submittedAt: new Date()
				},
				where: {
					id: +submission.id
				}
			})
			.then((submission) => {
				res.json(submission);
			})
			.catch((e) => {
				res.status(500).json(e);
			});
	}
);

router.delete('/:submissionAttachmentId', (req: Request, res: Response) => {
	prisma.submissionAttachment
		.delete({
			where: {
				id: +req.params.submissionAttachmentId
			}
		})
		.then((submissionAttachment) => {
			res.json(submissionAttachment);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
});

export default router;
