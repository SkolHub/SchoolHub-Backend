import { Response, NextFunction } from 'express';
import { Request } from '../models/requestModel';
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

			req.schoolClass = schoolClass;

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

			req.organization = organization;

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
				userId: +req.user!
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
							userId: +req.user!
						}
					})
					.then((createdSubmission) => {
						req.submission = createdSubmission;
					})
					.catch((e) => {
						res.json(e);
					});
			} else {
				req.submission = submission;
			}

			next();
		})
		.catch((e) => {
			res.json(e);
		});
};

export { schoolClassExists, submissionExists };
