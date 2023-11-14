import { Request, Response, prisma } from '../modules/controllerModule';

const getInviteLinks = (req: Request, res: Response) => {
	req.promise = prisma.organizationInvitations.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});
};

const createInviteLinks = (req: Request, res: Response) => {
	const invites: { organizationName: string; role: string }[] =
		req.body.invites;

	req.promise = prisma.organizationInvitations.createMany({
		data: invites.map((invite) => ({ ...invite, organizationId: 1 }))
	});
};

const updateInviteLink = (req: Request, res: Response) => {
	const { organizationName, role } = req.body;

	req.promise = prisma.organizationInvitations.update({
		where: {
			id: +req.params.inviteId
		},
		data: {
			organizationName,
			role
		}
	});
};

const joinOrganization = async (req: Request, res: Response) => {
	try {
		const { organizationName, organizationId, role } =
			await prisma.organizationInvitations.delete({
				where: {
					id: +req.params.inviteCode
				}
			});

		req.promise = prisma.userOrganization.create({
			data: {
				userId: req.user!,
				organizationId,
				organizationName,
				role
			}
		});
	} catch (e) {
		res.status(500).json(e);
	}
};

const deleteInviteLinks = (req: Request, res: Response) => {
	const invites: number[] = req.body.invites;

	req.promise = prisma.organizationInvitations.deleteMany({
		where: {
			id: {
				in: invites
			}
		}
	});
};

export default {
    getInviteLinks,
	createInviteLinks,
	joinOrganization,
	updateInviteLink,
	deleteInviteLinks
};
