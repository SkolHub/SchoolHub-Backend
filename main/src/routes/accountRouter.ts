import express from 'express';
import accountController from '../controllers/accountController';
import upload from '../../multer/upload';
import { body } from 'express-validator';
import { validate } from '../middleware/validatorMiddleware';

const router = express.Router();

router.get('/', accountController.getAccount);

const accountContentValidator = [
	body('username').exists().isString().isLength({ min: 3, max: 255 }),
	body('email').exists().isEmail(),
	body('firstName').exists().isString().isLength({ min: 1, max: 255 }),
	body('lastName').exists().isString().isLength({ min: 1, max: 255 })
];

router.put(
	'/',
	accountContentValidator,
	validate,
	accountController.updateAccount
);

router.put(
	'/picture',
	upload.single('picture'),
	accountController.updateProfilePicture
);

export default router;
