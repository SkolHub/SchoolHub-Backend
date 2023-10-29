import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getOrganizations = (req: Request, res: Response) => {
	const promise = prisma.userOrganization.findMany({
		where: { userId: +req.body.user },
		include: { organization: true }
	});

	handleResponse(promise, res);
};

const createOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	const promise = prisma.organization.create({
		data: {
			name,
			creatorId: req.body.user
		}
	});

	handleResponse(promise, res);
};

const updateOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	const promise = prisma.organization.update({
		where: {
			id: +req.params.id
		},
		data: {
			name
		}
	});

	handleResponse(promise, res);
};

const deleteOrganization = (req: Request, res: Response) => {
	const promise = prisma.organization.delete({
		where: {
			id: +req.params.id
		}
	});

	handleResponse(promise, res);
};

export default {
	getOrganizations,
	createOrganization,
	updateOrganization,
	deleteOrganization
};
