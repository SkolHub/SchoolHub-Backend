import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getAccount = (req: Request, res: Response) => {
	console.log(333)
	prisma.user
		.findUnique({
			where: {
				id: req.body.user
			}
		})
		.then((account) => {
			console.log(555)
			res.json({
				username: account?.username,
				email: account?.email,
				firstName: account?.firstName,
				lastName: account?.lastName,
				id: account?.id
			});
		})
		.catch((e) => {
			console.log(e)
			res.status(500).json(e);
		});
};

export default { getAccount };
