import { Request, Response, prisma } from '../modules/controllerModule';

const getClassAbsences = (req: Request, res: Response) => {
	req.promise = prisma.absence.findMany({
		where: {
			schoolClassId: +req.params.classId,
			userId: req.user!
		}
	});
};

const getOrganizationAbsences = (req: Request, res: Response) => {
	req.promise = prisma.absence.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});
};

const createAbsence = (req: Request, res: Response) => {
	const { date, user, schoolClass } = req.body;

	req.promise = prisma.absence.create({
		data: {
			date,
			excused: false,
			userId: user,
			schoolClassId: schoolClass.id,
			organizationId: schoolClass.organizationId
		}
	});
};

const excuseAbsence = (req: Request, res: Response) => {
	const { excused } = req.body;

	req.promise = prisma.absence.update({
		where: {
			id: +req.params.id
		},
		data: {
			excused
		}
	});
};

const deleteAbsence = (req: Request, res: Response) => {
	req.promise = prisma.absence.delete({
		where: {
			id: +req.params.id
		}
	});
};

export default {
	getClassAbsences,
	getOrganizationAbsences,
	createAbsence,
	excuseAbsence,
	deleteAbsence
};
