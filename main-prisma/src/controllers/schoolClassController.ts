import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const createSchoolClass = (req: Request, res: Response) => {
	const { name, identifier, subject, icon, theme } = req.body;

	prisma.schoolClass
		.create({
			data: {
				name,
				identifier,
				subject,
				icon,
				theme,
				creatorId: +req.body.user,
				organizationId: +req.params.organizationId
			}
		})
		.then((schoolClass) => {
			res.json(schoolClass);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const updateSchoolClass = (req: Request, res: Response) => {
	const { name, identifier, subject, icon, theme } = req.body;

	prisma.schoolClass
		.update({
			where: {
				id: +req.params.id
			},
			data: {
				name: name,
				identifier: identifier,
				subject: subject,
				icon: icon,
				theme: theme
			}
		})
		.then((schoolClass) => {
			res.json(schoolClass);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const deleteSchoolClass = (req: Request, res: Response) => {
	prisma.schoolClass
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((schoolClass) => {
			res.json(schoolClass);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default { createSchoolClass, updateSchoolClass, deleteSchoolClass };
