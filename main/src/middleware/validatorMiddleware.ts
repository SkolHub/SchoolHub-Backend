import { Response, NextFunction } from 'express';
import { Request } from '../models/requestModel';
import { validationResult } from 'express-validator';

const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	next();
};

export { validate };
