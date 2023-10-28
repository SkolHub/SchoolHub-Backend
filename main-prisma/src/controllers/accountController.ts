import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getAccount = (req: Request, res: Response) => {
	prisma.user
		.findUnique({
			where: {
				id: req.body.user
			}
		})
		.then((account) => {
			res.json({
				username: account?.username,
				email: account?.email,
				firstName: account?.firstName,
				lastName: account?.lastName,
				id: account?.id
			});
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default { getAccount };
