import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

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
			organizationId: +req.params.organizationId
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

export default { createSchoolClass, updateSchoolClass, deleteSchoolClass };
