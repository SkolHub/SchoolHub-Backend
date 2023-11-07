import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';
import { handleResponse } from '../handlers/responseHandler';

const getPostComments = (req: Request, res: Response) => {
	const promise = prisma.postComment.findMany({
		where: {
			postId: +req.params.postId
		}
	});

	handleResponse(promise, res);
};

const createPostComment = (req: Request, res: Response) => {
	const { body } = req.body;

	const promise = prisma.postComment.create({
		data: {
			body,
			userId: +req.body.user,
			postId: +req.params.postId
		}
	});

	handleResponse(promise, res);
};

const updatePostComment = (req: Request, res: Response) => {
	const { body } = req.body;

	const promise = prisma.postComment.update({
		where: {
			id: +req.params.id
		},
		data: {
			body
		}
	});

	handleResponse(promise, res);
};

const deletePostComment = (req: Request, res: Response) => {
	const promise = prisma.postComment.delete({
		where: {
			id: +req.params.id
		}
	});

	handleResponse(promise, res);
};

export default {
	getPostComments,
	createPostComment,
	updatePostComment,
	deletePostComment
};
