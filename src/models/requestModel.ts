import { Organization, SchoolClass, Submission } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { Multer } from 'multer';

interface Request extends ExpressRequest {
	user?: number;

	file?: Express.Multer.File;

	formData?: any;

	schoolClass?: SchoolClass;
	organization?: Organization;
	submission?: Submission;

	promise?: Promise<any>;
}

export { Request };
