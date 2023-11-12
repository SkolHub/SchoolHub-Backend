import { Request, Response, handleResponse, prisma } from '../modules/controllerModule';

const getOrganizations = (req: Request, res: Response) => {
	const promise = prisma.userOrganization.findMany({
		where: { userId: +req.user! },
		select: {
			organization: {
				select: {
					id: true,
					name: true
				}
			},
			role: true
		}
	});

	handleResponse(promise, res);
};

const createOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	const promise = prisma.organization.create({
		data: {
			name,
			creatorId: req.user!,
			users: {
				create: {
					role: 'admin',
					userId: req.user!,
					organizationName: 'admin'
				}
			}
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
