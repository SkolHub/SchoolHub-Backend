import { Response } from 'express';
import { Request } from '../models/requestModel';

const handleResponse = (req: Request, res: Response) => {
	req.promise
		?.then((data) => {
			res.json(data);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: 'Internal server error' });
		});
};

export { handleResponse };
