import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prisma-client';

const key = 'your_secret_key';

const login = (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	prisma.user
		.findUnique({
			where: username ? { username } : { email }
		})
		.then((user) => {
			if (!user) return res.status(404).json({ message: 'User not found' });

			bcrypt
				.compare(password, user.password)
				.then((validPassword) => {
					if (!validPassword)
						return res.status(401).json({ message: 'Wrong password' });

					res.json({ token: jwt.sign({ id: user.id }, key) });
				})
				.catch((e) => {
					res.status(500).json(e);
				});
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const register = (req: Request, res: Response) => {
	const { username, password, email, firstName, lastName } = req.body;

	bcrypt
		.hash(password, 10)
		.then((hashedPassword) => {
			prisma.user
				.create({
					data: {
						username,
						password: hashedPassword,
						email,
						firstName,
						lastName
					}
				})
				.then((user) => {
					res.json({
						username: user?.username,
						email: user?.email,
						firstName: user?.firstName,
						lastName: user?.lastName,
						id: user?.id
					});
				})
				.catch((e) => {
					res.status(500).json(e);
				});
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default { login, register };
