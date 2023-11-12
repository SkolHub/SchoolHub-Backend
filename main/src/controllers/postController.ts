import { Response } from 'express';
import { Request } from '../models/requestModel';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getClassPosts = (req: Request, res: Response) => {
	const promise = prisma.post.findMany({
		where: {
			schoolClassId: +req.params.classId,
			type: (req.query.type as string | undefined)
		},
		include: {
			attachments: true,
			comments: true
		}
	});

	handleResponse(promise, res);
};

const getOrganizationPosts = (req: Request, res: Response) => {
	const promise = prisma.post.findMany({
		where: {
			organizationId: +req.params.organizationId,
			type: (req.query.type as string | undefined)
		},
		include: {
			attachments: true,
			comments: true
		}
	});

	handleResponse(promise, res);
};

const createPost = (req: Request, res: Response) => {
	console.log(req.formData)
	const { title, body, type, schoolClass } = req.formData;

	const promise = prisma.post.create({
		data: {
			body,
			title,
			type,
			schoolClassId: schoolClass.id,
			organizationId: schoolClass.organizationId,
			attachments: {
				create:
					((req as any).files as Array<any>)?.map((file) => ({
						filepath: file.path,
						filename: file.filename
					})) || []
			}
		},
		include: {
			attachments: true
		}
	});

	handleResponse(promise, res);
};

const updatePost = (req: Request, res: Response) => {
	const { title, body } = req.body;

	const promise = prisma.post.update({
		where: {
			id: +req.params.id
		},
		data: {
			title,
			body
		}
	});

	handleResponse(promise, res);
};

const deletePost = (req: Request, res: Response) => {
	const promise = prisma.post.delete({
		where: {
			id: +req.params.id
		}
	});

	handleResponse(promise, res);
};

export default {
	getClassPosts,
	getOrganizationPosts,
	createPost,
	updatePost,
	deletePost
};
