import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getClassGrades = (req: Request, res: Response) => {
	prisma.grade
		.findMany({
			where: {
				schoolClassId: +req.params.classId,
				userId: req.body.user
			}
		})
		.then((grades) => {
			res.json(grades);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const getOrganizationGrades = (req: Request, res: Response) => {
	prisma.grade
		.findMany({
			where: {
				organizationId: +req.params.organizationId
			}
		})
		.then((grades) => {
			res.json(grades);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const createGrade = (req: Request, res: Response) => {
	const { date, value, user, schoolClass } = req.body;

	prisma.grade
		.create({
			data: {
				date,
				value,
				userId: user,
				schoolClassId: schoolClass.id,
				organizationId: schoolClass.organizationId
			}
		})
		.then((grade) => {
			res.json(grade);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const updateGrade = (req: Request, res: Response) => {
	const { date, value } = req.body;

	prisma.grade
		.update({
			where: {
				id: +req.params.id
			},
			data: {
				date,
				value
			}
		})
		.then((grade) => {
			res.json(grade);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const deleteGrade = (req: Request, res: Response) => {
	prisma.grade
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((grade) => {
			res.json(grade);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default {
	getClassGrades,
	getOrganizationGrades,
	createGrade,
	updateGrade,
	deleteGrade
};
