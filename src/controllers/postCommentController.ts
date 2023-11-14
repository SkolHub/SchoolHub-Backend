import { Request, Response, prisma } from '../modules/controllerModule';

const getPostComments = (req: Request, res: Response) => {
	req.promise = prisma.postComment.findMany({
		where: {
			postId: +req.params.postId
		}
	});
};

const createPostComment = (req: Request, res: Response) => {
	const { body } = req.body;

	req.promise = prisma.postComment.create({
		data: {
			body,
			userId: +req.user!,
			postId: +req.params.postId
		}
	});
};

const updatePostComment = (req: Request, res: Response) => {
	const { body } = req.body;

	req.promise = prisma.postComment.update({
		where: {
			id: +req.params.id
		},
		data: {
			body
		}
	});
};

const deletePostComment = (req: Request, res: Response) => {
	req.promise = prisma.postComment.delete({
		where: {
			id: +req.params.id
		}
	});
};

export default {
	getPostComments,
	createPostComment,
	updatePostComment,
	deletePostComment
};

function x(y: number) {
	return 69;
}