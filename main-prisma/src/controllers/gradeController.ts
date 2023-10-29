import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getClassGrades = (req: Request, res: Response) => {
	const promise = prisma.grade.findMany({
		where: {
			schoolClassId: +req.params.classId,
			userId: req.body.user
		}
	});

	handleResponse(promise, res);
};

const getOrganizationGrades = (req: Request, res: Response) => {
	const promise = prisma.grade.findMany({
		where: {
			organizationId: +req.params.organizationId
		}
	});

	handleResponse(promise, res);
};

const createGrade = (req: Request, res: Response) => {
	const { date, value, user, schoolClass } = req.body;

	const promise = prisma.grade.create({
		data: {
			date,
			value,
			userId: user,
			schoolClassId: schoolClass.id,
			organizationId: schoolClass.organizationId
		}
	});

	handleResponse(promise, res);
};

const updateGrade = (req: Request, res: Response) => {
	const { date, value } = req.body;

	const promise = prisma.grade.update({
		where: {
			id: +req.params.id
		},
		data: {
			date,
			value
		}
	});

	handleResponse(promise, res);
};

const deleteGrade = (req: Request, res: Response) => {
	const promise = prisma.grade.delete({
		where: {
			id: +req.params.id
		}
	});

	handleResponse(promise, res);
};

export default {
	getClassGrades,
	getOrganizationGrades,
	createGrade,
	updateGrade,
	deleteGrade
};
