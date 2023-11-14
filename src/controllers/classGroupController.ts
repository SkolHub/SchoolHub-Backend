import {
	Request,
	Response,
	prisma
} from '../modules/controllerModule';

const getGroupClass = (req: Request, res: Response) => {
	req.promise = prisma.classGroup.findUnique({
		where: {
			id: +req.params.groupId
		}
	});
};

const getGroupClasses = (req: Request, res: Response) => {
	req.promise = prisma.classGroup.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});
};

const createClassGroup = (req: Request, res: Response) => {
	const { name } = req.body;

	req.promise = prisma.classGroup.create({
		data: {
			name,
			organizationId: +req.params.organizationId
		}
	});
};

const addClassesToGroup = (req: Request, res: Response) => {
	const classes: number[] = req.body.classes;

	req.promise = prisma.classGroupSchoolClass.createMany({
		data: classes.map((schoolClassId) => ({
			schoolClassId,
			classGroupId: +req.params.groupId
		})),
		skipDuplicates: true
	});
};

const updateClassGroup = (req: Request, res: Response) => {
	const { name } = req.body;

	req.promise = prisma.classGroup.update({
		where: {
			id: +req.params.groupId
		},
		data: {
			name
		}
	});
};

const deleteClassGroup = (req: Request, res: Response) => {
	req.promise = prisma.classGroup.delete({
		where: {
			id: +req.params.groupId
		}
	});
};

const removeClassFromGroup = (req: Request, res: Response) => {
	req.promise = prisma.classGroupSchoolClass.deleteMany({
		where: {
			classGroupId: +req.params.groupId,
			schoolClassId: +req.params.classId
		}
	});
};

export default {
	getGroupClass,
	getGroupClasses,
	createClassGroup,
	addClassesToGroup,
	updateClassGroup,
	deleteClassGroup,
	removeClassFromGroup
};
