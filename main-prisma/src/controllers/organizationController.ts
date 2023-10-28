import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getOrganizations = (req: Request, res: Response) => {
	prisma.userOrganization
		.findMany({
			where: { userId: +req.body.user },
			include: { organization: true }
		})
		.then((organizations) => {
			res.json(organizations);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const createOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	prisma.organization
		.create({
			data: {
				name,
				creatorId: req.body.user
			}
		})
		.then((organization) => {
			res.json(organization);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const updateOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	prisma.organization
		.update({
			where: {
				id: +req.params.id
			},
			data: {
				name
			}
		})
		.then((organization) => {
			res.json(organization);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const deleteOrganization = (req: Request, res: Response) => {
	prisma.organization
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((organization) => {
			res.json(organization);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default {
	getOrganizations,
	createOrganization,
	updateOrganization,
	deleteOrganization
};
