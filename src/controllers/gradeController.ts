import { Request, Response, prisma } from '../modules/controllerModule';

const getClassGrades = (req: Request, res: Response) => {
	req.promise = prisma.grade.findMany({
		where: {
			schoolClassId: +req.params.classId,
			userId: req.user!
		}
	});
};

const getOrganizationGrades = (req: Request, res: Response) => {
	req.promise = prisma.grade.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});
};

const createGrade = (req: Request, res: Response) => {
	const { date, value, user, schoolClass } = req.body;

	req.promise = prisma.grade.create({
		data: {
			date,
			value,
			userId: user,
			schoolClassId: schoolClass.id,
			organizationId: schoolClass.organizationId
		}
	});
};

const updateGrade = (req: Request, res: Response) => {
	const { date, value } = req.body;

	req.promise = prisma.grade.update({
		where: {
			id: +req.params.id
		},
		data: {
			date,
			value
		}
	});
};

const deleteGrade = (req: Request, res: Response) => {
	req.promise = prisma.grade.delete({
		where: {
			id: +req.params.id
		}
	});
};

export default {
	getClassGrades,
	getOrganizationGrades,
	createGrade,
	updateGrade,
	deleteGrade
};
