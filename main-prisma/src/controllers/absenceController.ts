import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getClassAbsences = (req: Request, res: Response) => {
	prisma.absence
		.findMany({
			where: {
				schoolClassId: +req.params.classId,
				userId: req.body.user
			}
		})
		.then((absences) => {
			res.json(absences);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const getOrganizationAbsences = (req: Request, res: Response) => {
	prisma.absence
		.findMany({
			where: {
				organizationId: +req.params.organizationId
			}
		})
		.then((absences) => {
			res.json(absences);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const createAbsence = (req: Request, res: Response) => {
	const { date, user, schoolClass } = req.body;

	prisma.absence
		.create({
			data: {
				date,
				excused: false,
				userId: user,
				schoolClassId: schoolClass.id,
				organizationId: schoolClass.organizationId
			}
		})
		.then((absence) => {
			res.json(absence);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const excuseAbsence = (req: Request, res: Response) => {
	const { excused } = req.body;

	prisma.absence
		.update({
			where: {
				id: +req.params.id
			},
			data: {
				excused
			}
		})
		.then((absence) => {
			res.json(absence);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const deleteAbsence = (req: Request, res: Response) => {
	prisma.absence
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((absence) => {
			res.json(absence);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default {
	getClassAbsences,
	getOrganizationAbsences,
	createAbsence,
	excuseAbsence,
	deleteAbsence
};
