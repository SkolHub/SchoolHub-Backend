import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import prisma from '../../prisma/prisma-client';
import { validate } from '../middleware/validatorMiddleware';
import upload from '../../multer/upload';
import { schoolClassExists } from '../middleware/existsMiddleware';
import postController from '../controllers/postController';

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
	createPostValidator,
	validate,
	schoolClassExists,
	upload.array('attachments', 5),
	postController.createPost
);

const updatePostValidator = [
	body('title').exists().isString().isLength({ min: 1, max: 255 }),
	body('body').exists().isString().isLength({ min: 1 })
];

router.put('/:id', updatePostValidator, validate, postController.updatePost);

router.delete('/:id', postController.deletePost);

export default router;
