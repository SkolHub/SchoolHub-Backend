import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validatorMiddleware';
import postCommentController from '../controllers/postCommentController';

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
