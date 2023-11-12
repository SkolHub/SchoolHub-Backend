import { Request, Response, handleResponse, prisma } from '../modules/controllerModule';

const getSchoolClasses = (req: Request, res: Response) => {
	const promise = prisma.userSchoolClass.findMany({
		where: {
			userId: req.user!,
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
			creatorId: +req.user!,
			organizationId: +req.params.organizationId,
			users: {
				create: {
					organizationId: +req.params.organizationId,
					userId: +req.user!
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
	getSchoolClasses,
	createSchoolClass,
	updateSchoolClass,
	deleteSchoolClass
};
