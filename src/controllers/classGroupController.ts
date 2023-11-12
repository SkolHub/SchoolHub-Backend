import {
	Request,
	Response,
	handleResponse,
	prisma
} from '../modules/controllerModule';

const getGroupClass = (req: Request, res: Response) => {
	const promise = prisma.classGroup.findUnique({
		where: {
			id: +req.params.groupId
		}
	});

	handleResponse(promise, res);
};

const getGroupClasses = (req: Request, res: Response) => {
	const promise = prisma.classGroup.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});

	handleResponse(promise, res);
};

const createClassGroup = (req: Request, res: Response) => {
	const { name } = req.body;

	const promise = prisma.classGroup.create({
		data: {
			name,
			organizationId: +req.params.organizationId
		}
	});

	handleResponse(promise, res);
};

const addClassesToGroup = (req: Request, res: Response) => {
	const classes: number[] = req.body.classes;

	const promise = prisma.classGroupSchoolClass.createMany({
		data: classes.map((schoolClassId) => ({
			schoolClassId,
			classGroupId: +req.params.groupId
		})),
		skipDuplicates: true
	});

	handleResponse(promise, res);
};

const updateClassGroup = (req: Request, res: Response) => {
	const { name } = req.body;

	const promise = prisma.classGroup.update({
		where: {
			id: +req.params.groupId
		},
		data: {
			name
		}
	});

	handleResponse(promise, res);
};

const deleteClassGroup = (req: Request, res: Response) => {
	const promise = prisma.classGroup.delete({
		where: {
			id: +req.params.groupId
		}
	});

	handleResponse(promise, res);
};

const removeClassFromGroup = (req: Request, res: Response) => {
	const promise = prisma.classGroupSchoolClass.deleteMany({
		where: {
			classGroupId: +req.params.groupId,
			schoolClassId: +req.params.classId
		}
	});

	handleResponse(promise, res);
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
