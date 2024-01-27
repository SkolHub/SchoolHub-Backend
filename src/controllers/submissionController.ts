import { Request, Response, handleResponse, prisma } from '../modules/controllerModule';

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
	const promise = prisma.submissionAttachment.create({
		data: {
			filename: (req as any).file!.originalname,
			filepath: (req as any).file!.path,
			submissionId: req.submission!.id
		}
	});

	handleResponse(promise, res);
};

const submitSubmission = (req: Request, res: Response) => {
	const { submitted } = req.body;

	const promise = prisma.submission.update({
		data: {
			submitted,
			submittedAt: new Date()
		},
		where: {
			id: +req.submission!.id
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
