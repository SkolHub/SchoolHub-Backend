import { Response } from 'express';
import { Request } from '../models/requestModel';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getSubmission = (req: Request, res: Response) => {
	const promise = prisma.submission.findFirst({
		where: {
			postId: +req.params.postId,
			userId: +req.user!
		},
		include: {
			attachments: true
		}
	});

	handleResponse(promise, res);
};

const addSubmissionAttachment = (req: Request, res: Response) => {
	const { submission } = req.body;

	const promise = prisma.submissionAttachment.create({
		data: {
			filename: (req as any).file!.filename,
			filepath: (req as any).file!.path,
			submissionId: submission.id
		}
	});

	handleResponse(promise, res);
};

const submitSubmission = (req: Request, res: Response) => {
	const { submitted, submission } = req.body;

	const promise = prisma.submission.update({
		data: {
			submitted,
			submittedAt: new Date()
		},
		where: {
			id: +submission.id
		}
	});

	handleResponse(promise, res);
};

const deleteSubmissionAttachment = (req: Request, res: Response) => {
	const promise = prisma.submissionAttachment.delete({
		where: {
			id: +req.params.submissionAttachmentId
		}
	});

	handleResponse(promise, res);
};

export default {
	getSubmission,
	addSubmissionAttachment,
	submitSubmission,
	deleteSubmissionAttachment
};
