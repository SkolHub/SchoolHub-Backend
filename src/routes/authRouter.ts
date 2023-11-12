import {
	express,
	body,
	oneOf,
	validate,
	authController
} from '../modules/routerModule';

const router = express.Router();

const loginValidator = [
	oneOf([
		body('username').optional().isString(),
		body('email').optional().isString()
	]),
	body('password').exists().isString()
];

router.post('/login', loginValidator, validate, authController.login);

const registerValidator = [
	body('username').exists().isString().isLength({ min: 3, max: 255 }),
	body('email').exists().isEmail(),
	body('password').exists().isString().isLength({ min: 4, max: 255 }),
	body('firstName').exists().isString().isLength({ min: 1, max: 255 }),
	body('lastName').exists().isString().isLength({ min: 1, max: 255 })
];

router.post('/register', registerValidator, validate, authController.register);

export default router;
