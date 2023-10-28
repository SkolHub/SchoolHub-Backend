import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getClassPosts = (req: Request, res: Response) => {
	prisma.post
		.findMany({
			where: {
				schoolClassId: +req.params.classId
			},
			include: {
				attachments: true,
				comments: true
			}
		})
		.then((posts) => {
			res.json(posts);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const getOrganizationPosts = (req: Request, res: Response) => {
	prisma.post
		.findMany({
			where: {
				organizationId: +req.params.organizationId
			},
			include: {
				attachments: true,
				comments: true
			}
		})
		.then((posts) => {
			res.json(posts);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const createPost = (req: Request, res: Response) => {
	const { title, body, type, schoolClass } = req.body;

	prisma.post
		.create({
			data: {
				body,
				title,
				type,
				schoolClassId: schoolClass.id,
				organizationId: schoolClass.organizationId,
				attachments: {
					create:
						(req.files as Array<any>)?.map((file) => ({
							filepath: file.path,
							filename: file.filename
						})) || []
				}
			},
			include: {
				attachments: true
			}
		})
		.then((post) => {
			res.json(post);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const updatePost = (req: Request, res: Response) => {
	const { title, body } = req.body;

	prisma.post
		.update({
			where: {
				id: +req.params.id
			},
			data: {
				title,
				body
			}
		})
		.then((post) => {
			res.json(post);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const deletePost = (req: Request, res: Response) => {
	prisma.post
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((post) => {
			res.json(post);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default {
	getClassPosts,
	getOrganizationPosts,
	createPost,
	updatePost,
	deletePost
};
