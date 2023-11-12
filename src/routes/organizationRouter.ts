import {
	express,
	body,
	validate,
	organizationController
} from '../modules/routerModule';

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
