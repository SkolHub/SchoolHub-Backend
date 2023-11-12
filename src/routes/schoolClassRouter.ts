import {express, body, validate, schoolClassController} from '../modules/routerModule';

const router = express.Router();

router.get('/:organizationId', schoolClassController.getSchoolClasses);

const schoolClassContentValidator = [
	body('name').exists().isString().isLength({ min: 3, max: 255 }),
	body('identifier').exists().isString().isLength({ min: 1, max: 255 }),
	body('subject').exists().isString().isLength({ min: 3, max: 255 }),
	body('icon').exists().isString().isLength({ min: 3, max: 255 }),
	body('theme').exists().isString().isLength({ min: 3, max: 255 })
];

router.post(
	'/:organizationId',
	schoolClassContentValidator,
	validate,
	schoolClassController.createSchoolClass
);

router.put(
	'/:id',
	schoolClassContentValidator,
	validate,
	schoolClassController.updateSchoolClass
);

router.delete('/:id', schoolClassController.deleteSchoolClass);

export default router;
