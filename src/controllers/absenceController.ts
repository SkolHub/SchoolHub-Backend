import { Request, Response, handleResponse, prisma } from '../modules/controllerModule';

const getClassAbsences = (req: Request, res: Response) => {
	const promise = prisma.absence.findMany({
		where: {
			schoolClassId: +req.params.classId,
			userId: req.user!
		}
	});

	handleResponse(promise, res);
};

const getOrganizationAbsences = (req: Request, res: Response) => {
	const promise = prisma.absence.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});

	handleResponse(promise, res);
};

const createAbsence = (req: Request, res: Response) => {
	const { date, user, schoolClass } = req.body;

	const promise = prisma.absence.create({
		data: {
			date,
			excused: false,
			userId: user,
			schoolClassId: schoolClass.id,
			organizationId: schoolClass.organizationId
		}
	});

	handleResponse(promise, res);
};

const excuseAbsence = (req: Request, res: Response) => {
	const { excused } = req.body;

	const promise = prisma.absence.update({
		where: {
			id: +req.params.id
		},
		data: {
			excused
		}
	});

	handleResponse(promise, res);
};

const deleteAbsence = (req: Request, res: Response) => {
	const promise = prisma.absence.delete({
		where: {
			id: +req.params.id
		}
	});

	handleResponse(promise, res);
};

export default {
	getClassAbsences,
	getOrganizationAbsences,
	createAbsence,
	excuseAbsence,
	deleteAbsence
};
