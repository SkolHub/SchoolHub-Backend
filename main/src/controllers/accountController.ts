import { Response } from 'express';
import { Request } from '../models/requestModel';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getAccount = (req: Request, res: Response) => {
	prisma.user
		.findUnique({
			where: {
				id: req.user!
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

const updateProfilePicture = (req: Request, res: Response) => {
	if (!req.file) return res.status(400).json({ message: 'No picture' });

	prisma.user
		.update({
			where: {
				id: req.user!
			},
			data: {
				picturePath: req.file.filename
			}
		})
		.then(() => {
			res.json({ file: req.file?.filename });
		})
		.catch(() => {
			res.status(500).json({ message: 'Internal server error' });
		});
};

export default { getAccount, updateProfilePicture };
