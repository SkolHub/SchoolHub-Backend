import { Request, Response, prisma } from '../modules/controllerModule';

const getSubmission = (req: Request, res: Response) => {
	req.promise = prisma.submission.findFirst({
		where: {
			postId: +req.params.postId,
			userId: +req.user!
		},
		include: {
			attachments: true
		}
	});
};

const addSubmissionAttachment = (req: Request, res: Response) => {
	const { submission } = req.body;

	req.promise = prisma.submissionAttachment.create({
		data: {
			filename: (req as any).file!.filename,
			filepath: (req as any).file!.path,
			submissionId: submission.id
		}
	});
};

const submitSubmission = (req: Request, res: Response) => {
	const { submitted, submission } = req.body;

	req.promise = prisma.submission.update({
		data: {
			submitted,
			submittedAt: new Date()
		},
		where: {
			id: +submission.id
		}
	});
};

const deleteSubmissionAttachment = (req: Request, res: Response) => {
	req.promise = prisma.submissionAttachment.delete({
		where: {
			id: +req.params.submissionAttachmentId
		}
	});
};

export default {
	getSubmission,
	addSubmissionAttachment,
	submitSubmission,
	deleteSubmissionAttachment
};
