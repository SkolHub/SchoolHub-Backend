import { Request, Response, handleResponse, prisma } from '../modules/controllerModule';

const getInviteLinks = (req: Request, res: Response) => {
	const promise  = prisma.organizationInvitations.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});

    handleResponse(promise, res);
};

const createInviteLinks = (req: Request, res: Response) => {
	const invites: { organizationName: string; role: string }[] = req.body;

	const promise  = prisma.organizationInvitations.createMany({
		data: invites.map((invite) => ({ ...invite, organizationId: 1 }))
	});

    handleResponse(promise, res);
};

const updateInviteLink = (req: Request, res: Response) => {
	const { organizationName, role } = req.body;

	const promise  = prisma.organizationInvitations.update({
		where: {
			id: +req.params.inviteId
		},
		data: {
			organizationName,
			role
		}
	});

    handleResponse(promise, res);
};

const joinOrganization = async (req: Request, res: Response) => {
	try {
		const { organizationName, organizationId, role } =
			await prisma.organizationInvitations.delete({
				where: {
					id: +req.params.inviteCode
				}
			});

		const promise  = prisma.userOrganization.create({
			data: {
				userId: req.user!,
				organizationId,
				organizationName,
				role
			}
		});

        handleResponse(promise, res);
	} catch (e) {
		res.status(500).json(e);
	}
};

const deleteInviteLinks = (req: Request, res: Response) => {
	const invites: number[] = req.body;

	const promise  = prisma.organizationInvitations.deleteMany({
		where: {
			id: {
				in: invites
			},
			organizationId: +req.params.organizationId
		}
	});

    handleResponse(promise, res);
};

export default {
	getInviteLinks,
	createInviteLinks,
	joinOrganization,
	updateInviteLink,
	deleteInviteLinks
};
