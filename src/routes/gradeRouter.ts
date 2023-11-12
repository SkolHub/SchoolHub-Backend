import {
	express,
	body,
	validate,
	schoolClassExists,
	gradeController
} from '../modules/routerModule';

const router = express.Router();

router.get('/class/:classId/student', gradeController.getClassGrades);

router.get(
	'/organization/:organizationId/student',
	gradeController.getOrganizationGrades
);

const createGradeValidator = [
	body('value').exists().isString().isLength({ min: 1, max: 255 }),
	body('date').exists().isDate(),
	body('User').exists().isInt()
];

router.post(
	'/:classId',
	createGradeValidator,
	validate,
	schoolClassExists,
	gradeController.createGrade
);

const updateGradeValidator = [
	body('value').exists().isString().isLength({ min: 1, max: 255 }),
	body('date').exists().isDate()
];

router.put('/:id', updateGradeValidator, validate, gradeController.updateGrade);

router.delete('/:id', gradeController.deleteGrade);

export default router;
