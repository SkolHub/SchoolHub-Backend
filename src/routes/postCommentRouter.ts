import {
	express,
	body,
	validate,
	postCommentController
} from '../modules/routerModule';

const router = express.Router();

router.get('/:postId', postCommentController.getPostComments);

const postCommentContentValidator = [
	body('body').exists().isString().isLength({ min: 1 })
];

router.post(
	'/:postId',
	postCommentContentValidator,
	validate,
	postCommentController.createPostComment
);

router.put(
	'/:id',
	postCommentContentValidator,
	validate,
	postCommentController.updatePostComment
);

router.delete('/:id', postCommentController.deletePostComment);

export default router;
