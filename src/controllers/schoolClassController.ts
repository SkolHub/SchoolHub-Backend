import { Request, Response, prisma } from '../modules/controllerModule';

const getSchoolClasses = (req: Request, res: Response) => {
	req.promise = prisma.userSchoolClass.findMany({
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
};

const createSchoolClass = (req: Request, res: Response) => {
	const { name, identifier, subject, icon, theme } = req.body;

	req.promise = prisma.schoolClass.create({
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
};

const updateSchoolClass = (req: Request, res: Response) => {
	const { name, identifier, subject, icon, theme } = req.body;

	req.promise = prisma.schoolClass.update({
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
};

const deleteSchoolClass = (req: Request, res: Response) => {
	req.promise = prisma.schoolClass.delete({
		where: {
			id: +req.params.id
		}
	});
};

export default {
	getSchoolClasses,
	createSchoolClass,
	updateSchoolClass,
	deleteSchoolClass
};
