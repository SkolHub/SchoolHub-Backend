import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma/prisma-client';

const isStudentInOrganization = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	prisma.userOrganization
		.findFirst({
			where: {
				organizationId: +req.params.organizationId,
				userId: req.body.user
			}
		})
		.then((userOrganization) => {
			if (!userOrganization || userOrganization.role != 'student')
				return res.status(403);

			next();
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const isStudentInClass = (
	req: Request,
	res: Response,
	next: NextFunction
) => {};

const isTeacherInOrganization = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	prisma.userOrganization
		.findFirst({
			where: {
				organizationId: +req.params.organizationId,
				userId: req.body.user
			}
		})
		.then((userOrganization) => {
			if (!userOrganization || userOrganization.role != 'teacher')
				return res.status(403);

			next();
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const isTeacherInClass = (
	req: Request,
	res: Response,
	next: NextFunction
) => {};

const isAdminInOrganization = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	prisma.userOrganization
		.findFirst({
			where: {
				organizationId: +req.params.organizationId,
				userId: req.body.user
			}
		})
		.then((userOrganization) => {
			if (!userOrganization || userOrganization.role != 'admin')
				return res.status(403);

			next();
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export {
	isStudentInOrganization,
	isStudentInClass,
	isTeacherInOrganization,
	isTeacherInClass,
	isAdminInOrganization
};
