import {
	express,
	body,
	validate,
	schoolClassExists,
	upload,
	postController,
	saveFormData
} from '../modules/routerModule';

const router = express.Router();

router.get('/class/:classId/student', postController.getClassPosts);

router.get(
	'/organization/:organizationId/student',
	postController.getOrganizationPosts
);

const createPostValidator = [
	body('title').exists().isString().isLength({ min: 1, max: 255 }),
	body('body').exists().isString().isLength({ min: 1 }),
	body('type').exists().isIn(['announcement', 'assignment'])
];

router.post(
	'/:classId',
	saveFormData,
	schoolClassExists,
	upload.array('attachments', 5),
	createPostValidator,
	validate,
	postController.createPost
);

const updatePostValidator = [
	body('title').exists().isString().isLength({ min: 1, max: 255 }),
	body('body').exists().isString().isLength({ min: 1 })
];

router.put('/:id', updatePostValidator, validate, postController.updatePost);

router.delete('/:id', postController.deletePost);

export default router;
