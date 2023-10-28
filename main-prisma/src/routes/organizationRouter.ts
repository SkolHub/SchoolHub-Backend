import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validatorMiddleware';
import organizationController from '../controllers/organizationController';

const router = express.Router();

const organizationContentValidator = [
	body('name').exists().isString().isLength({ min: 1, max: 255 })
];

router.get('/', organizationController.getOrganizations);

router.post(
	'/',
	organizationContentValidator,
	validate,
	organizationController.createOrganization
);

router.put(
	'/:id',
	organizationContentValidator,
	validate,
	organizationController.updateOrganization
);

router.delete('/:id', organizationController.deleteOrganization);

export default router;
