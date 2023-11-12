import {
	express,
	body,
	validate,
	classGroupController
} from '../modules/routerModule';

const router = express.Router();

const classGroupContentValidator = [
	body('name').exists().isString().isLength({ min: 3, max: 255 })
];

router.post('/:organizationId', classGroupContentValidator, validate);

router.put('/:groupId', classGroupContentValidator, validate);

router.delete('/:groupId');

export default router;
