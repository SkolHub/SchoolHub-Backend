import {
	express,
	body,
	validate,
	schoolClassExists,
	absenceController
} from '../modules/routerModule';

const router = express.Router();

router.get('/class/:classId/student', absenceController.getClassAbsences);

router.get(
	'/organization/:organizationId/student',
	absenceController.getOrganizationAbsences
);

const createAbsenceValidator = [
	body('date').exists().isISO8601(),
	body('user').exists().isInt()
];

router.post(
	'/:classId',
	createAbsenceValidator,
	validate,
	schoolClassExists,
	absenceController.createAbsence
);

const updateAbsenceValidator = [body('excused').exists().isBoolean()];

router.put(
	'/:id',
	updateAbsenceValidator,
	validate,
	absenceController.excuseAbsence
);

router.delete('/:id', absenceController.deleteAbsence);

export default router;
