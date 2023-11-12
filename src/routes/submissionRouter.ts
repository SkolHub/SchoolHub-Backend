import {express, body, validate, upload, submissionExists, submissionController} from '../modules/routerModule';

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
