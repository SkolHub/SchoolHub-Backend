import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getSubmission = (req: Request, res: Response) => {
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
};

const addSubmissionAttachment = (req: Request, res: Response) => {
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
};

const submitSubmission = (req: Request, res: Response) => {
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
};

const deleteSubmissionAttachment = (req: Request, res: Response) => {
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
};

export default {
	getSubmission,
	addSubmissionAttachment,
	submitSubmission,
	deleteSubmissionAttachment
};
