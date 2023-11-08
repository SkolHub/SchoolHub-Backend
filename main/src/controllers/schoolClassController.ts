import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getClasses = (req: Request, res: Response) => {
	const promise = prisma.userSchoolClass.findMany({
		where: {
			userId: req.body.user,
			organizationId: +req.params.organizationId
		},
		select: {
			schoolClass: { 
				include: {
					creator: {
						select: {
							firstName: true,
							lastName: true,
							username: true,
							email: true
						}
					}
				}
			}
		}
	});

	handleResponse(promise, res);
};

const createSchoolClass = (req: Request, res: Response) => {
	const { name, identifier, subject, icon, theme } = req.body;

	const promise = prisma.schoolClass.create({
		data: {
			name,
			identifier,
			subject,
			icon,
			theme,
			creatorId: +req.body.user,
			organizationId: +req.params.organizationId,
			users: {
				create: {
					organizationId: +req.params.organizationId,
					userId: +req.body.user
				}
			}
		}
	});

	handleResponse(promise, res);
};

const updateSchoolClass = (req: Request, res: Response) => {
	const { name, identifier, subject, icon, theme } = req.body;

	const promise = prisma.schoolClass.update({
		where: {
			id: +req.params.id
		},
		data: {
			name: name,
			identifier: identifier,
			subject: subject,
			icon: icon,
			theme: theme
		}
	});

	handleResponse(promise, res);
};

const deleteSchoolClass = (req: Request, res: Response) => {
	const promise = prisma.schoolClass.delete({
		where: {
			id: +req.params.id
		}
	});

	handleResponse(promise, res);
};

export default {
	getClasses,
	createSchoolClass,
	updateSchoolClass,
	deleteSchoolClass
};
