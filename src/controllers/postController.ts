import { Request, Response, prisma } from '../modules/controllerModule';

const getClassPosts = (req: Request, res: Response) => {
	req.promise = prisma.post.findMany({
		where: {
			schoolClassId: +req.params.classId,
			type: (req.query.type as string | undefined)
		},
		include: {
			attachments: true,
			comments: true
		}
	});
};

const getOrganizationPosts = (req: Request, res: Response) => {
	req.promise = prisma.post.findMany({
		where: {
			organizationId: +req.params.organizationId,
			type: (req.query.type as string | undefined)
		},
		include: {
			attachments: true,
			comments: true
		}
	});
};

const createPost = (req: Request, res: Response) => {
	console.log(req.formData)
	const { title, body, type, schoolClass } = req.formData;

	req.promise = prisma.post.create({
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
};

const updatePost = (req: Request, res: Response) => {
	const { title, body } = req.body;

	req.promise = prisma.post.update({
		where: {
			id: +req.params.id
		},
		data: {
			title,
			body
		}
	});
};

const deletePost = (req: Request, res: Response) => {
	req.promise = prisma.post.delete({
		where: {
			id: +req.params.id
		}
	});
};

export default {
	getClassPosts,
	getOrganizationPosts,
	createPost,
	updatePost,
	deletePost
};
