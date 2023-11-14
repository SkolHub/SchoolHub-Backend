import { Request, Response, prisma } from '../modules/controllerModule';

const getOrganizations = (req: Request, res: Response) => {
	req.promise = prisma.userOrganization.findMany({
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
};

const createOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	req.promise = prisma.organization.create({
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
};

const updateOrganization = (req: Request, res: Response) => {
	const { name } = req.body;

	req.promise = prisma.organization.update({
		where: {
			id: +req.params.id
		},
		data: {
			name
		}
	});
};

const deleteOrganization = (req: Request, res: Response) => {
	req.promise = prisma.organization.delete({
		where: {
			id: +req.params.id
		}
	});
};

export default {
	getOrganizations,
	createOrganization,
	updateOrganization,
	deleteOrganization
};
