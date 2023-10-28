import { Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

const getPostComments = (req: Request, res: Response) => {
	prisma.postComment
		.findMany({
			where: {
				postId: +req.params.postId
			}
		})
		.then((comments) => {
			res.json(comments);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const createPostComment = (req: Request, res: Response) => {
	const { body } = req.body;

	prisma.postComment
		.create({
			data: {
				body,
				userId: +req.body.user,
				postId: +req.params.postId
			}
		})
		.then((comment) => {
			res.json(comment);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const updatePostComment = (req: Request, res: Response) => {
	const { body } = req.body;

	prisma.postComment
		.update({
			where: {
				id: +req.params.id
			},
			data: {
				body
			}
		})
		.then((comment) => {
			res.json(comment);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

const deletePostComment = (req: Request, res: Response) => {
	prisma.postComment
		.delete({
			where: {
				id: +req.params.id
			}
		})
		.then((comment) => {
			res.json(comment);
		})
		.catch((e) => {
			res.status(500).json(e);
		});
};

export default {
	getPostComments,
	createPostComment,
	updatePostComment,
	deletePostComment
};
