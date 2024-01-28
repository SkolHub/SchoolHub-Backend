import { Request, Response, handleResponse, prisma } from '../modules/controllerModule';

const getPost = (req: Request, res: Response) => {
	const promise = prisma.post.findUnique({
		where: {
			id: +req.params.postId
		},
		include: {
			attachments: true,
			comments: true,
			author: {
				select: {
					email: true,
					firstName: true,
					lastName: true,
					id: true
				}
			}
		}
	});

	handleResponse(promise, res);
};

const getClassPosts = (req: Request, res: Response) => {
	const promise = prisma.post.findMany({
		where: {
			schoolClassId: +req.params.classId,
			type: (req.query.type as string | undefined)
		},
		include: {
			attachments: true,
			comments: true,
			author: {
				select: {
					email: true,
					firstName: true,
					lastName: true,
					id: true
				}
			}
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
			comments: true,
			author: {
				select: {
					email: true,
					firstName: true,
					lastName: true,
					id: true
				}
			}
		}
	});

	handleResponse(promise, res);
};

const createPost = (req: Request, res: Response) => {
	const { title, body, type, dueDate } = req.body;

	const promise = prisma.post.create({
		data: {
			body,
			title,
			type,
			date: new Date(),
			dueDate,
			schoolClassId: req.schoolClass!.id,
			organizationId: req.schoolClass!.organizationId,
			authorId: +req.user!,
			attachments: {
				create:
					((req as any).files as Array<any>)?.map((file) => ({
						filepath: file.path,
						filename: file.originalname
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
	deletePost,
	getPost
};
