import {
	body,
	express,
	inviteLinkController,
	validate
} from '../modules/routerModule';

const router = express.Router();

router.get('/:organizationId', inviteLinkController.getInviteLinks);

const inviteListValidator = [body('invites').exists().isArray()];

router.post(
	'/:organizationId',
	inviteListValidator,
	validate,
	inviteLinkController.createInviteLinks
);

router.post('/join/:inviteCode', inviteLinkController.joinOrganization);

const inviteContentValidator = [
	body('organizationName').exists().isString().isLength({ min: 3, max: 255 }),
	body('role').exists().isString().isLength({ min: 3, max: 255 })
];

router.put(
	'/:inviteId',
	inviteContentValidator,
	validate,
	inviteLinkController.updateInviteLink
);

router.delete(
	'/:inviteId',
	inviteListValidator,
	validate,
	inviteLinkController.deleteInviteLinks
);

export default router;
