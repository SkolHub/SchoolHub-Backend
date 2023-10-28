import express from 'express';
import { body } from 'express-validator';
import upload from '../../multer/upload';
import { validate } from '../middleware/validatorMiddleware';
import { submissionExists } from '../middleware/existsMiddleware';
import submissionController from '../controllers/submissionController';

const router = express.Router();

router.get('/:postId', submissionController.getSubmission);

router.post(
	'/:postId',
	submissionExists,
	upload.single('attachment'),
	submissionController.addSubmissionAttachment
);

const schoolClassContentValidator = [body('submitted').exists().isBoolean()];

router.put(
	'/:postId/submit',
	schoolClassContentValidator,
	submissionExists,
	validate,
	submissionController.submitSubmission
);

router.delete(
	'/:submissionAttachmentId',
	submissionController.deleteSubmissionAttachment
);

export default router;
