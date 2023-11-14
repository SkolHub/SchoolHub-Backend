import { Response } from 'express';

const handleResponse = (promise: Promise<any>, res: Response) => {
	promise
		.then((data) => {
			res.json(data);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({ message: 'Internal server error' });
		});
};

export { handleResponse };
