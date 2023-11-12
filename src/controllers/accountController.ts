import { Request, Response, prisma } from '../modules/controllerModule';

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

const updateAccount = (req: Request, res: Response) => {
	prisma.user
		.update({
			where: {
				id: req.user!
			},
			data: {
				username: req.body.username,
				email: req.body.email,
				firstName: req.body.firstName,
				lastName: req.body.lastName
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
		.catch(() => {
			res.status(500).json({ message: 'Internal server error' });
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

export default { getAccount, updateAccount, updateProfilePicture };
