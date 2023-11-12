import {
	express,
	body,
	validate,
	classGroupController
} from '../modules/routerModule';

const router = express.Router();

router.get('/:groupId', classGroupController.getGroupClass);

router.get(
	'/organization/:organizationId',
	classGroupController.getGroupClasses
);

const classGroupContentValidator = [
	body('name').exists().isString().isLength({ min: 3, max: 255 })
];

router.post(
	'/:organizationId',
	classGroupContentValidator,
	validate,
	classGroupController.createClassGroup
);

const groupClassesValidator = [
	body('classes')
		.exists()
		.isArray({ min: 1, max: 10 })
		.withMessage("Can't add more than 10 classes at once")
];

router.post(
	'/classes/:groupId',
	groupClassesValidator,
	validate,
	classGroupController.addClassesToGroup
);

router.put(
	'/:groupId',
	classGroupContentValidator,
	validate,
	classGroupController.updateClassGroup
);

router.delete('/:groupId', classGroupController.deleteClassGroup);

router.delete(
	'/:groupId/class/:classId/',
	groupClassesValidator,
	validate,
	classGroupController.removeClassFromGroup
);

export default router;
