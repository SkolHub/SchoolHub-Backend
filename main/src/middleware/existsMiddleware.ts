import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/prisma-client';

const schoolClassExists = (req: Request, res: Response, next: NextFunction) => {
	prisma.schoolClass
		.findUnique({
			where: {
				id: +req.params.classId
			}
		})
		.then((schoolClass) => {
			if (!schoolClass)
				return res.status(404).json({ message: 'Class not found.' });

			req.body.schoolClass = schoolClass;

			next();
		});
};

const organizationExists = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	prisma.organization
		.findUnique({
			where: {
				id: +req.params.classId
			}
		})
		.then((organization) => {
			if (!organization)
				return res.status(404).json({ message: 'Organization not found.' });

			req.body.schoolClass = organization;

			next();
		})
		.catch((e) => {
			res.json(e);
		});
};

const submissionExists = (req: Request, res: Response, next: NextFunction) => {
	prisma.submission
		.findFirst({
			where: {
				postId: +req.params.postId,
				userId: +req.body.user
			}
		})
		.then((submission) => {
			if (!submission) {
				prisma.submission
					.create({
						data: {
							submitted: false,
							submittedAt: new Date(),
							postId: +req.params.postId,
							userId: +req.body.user
						}
					})
					.then((createdSubmission) => {
						req.body.submission = createdSubmission;
					})
					.catch((e) => {
						res.json(e);
					});
			} else {
				req.body.submission = submission;
			}

			next();
		})
		.catch((e) => {
			res.json(e);
		});
};

export { schoolClassExists, submissionExists };
