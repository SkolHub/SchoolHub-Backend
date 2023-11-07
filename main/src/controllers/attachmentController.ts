import { Request, Response } from 'express';
import path from 'path';

const getFile = (req: Request, res: Response) => {
	res.sendFile(path.resolve(`/multer/uploads/${req.params.path}`), (e) => {
		res.status(500).json(e);
	});
};

export default { getFile };
