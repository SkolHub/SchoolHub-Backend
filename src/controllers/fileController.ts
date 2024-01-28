import { Request, Response } from '../modules/controllerModule';
import path from 'path';

const getFile = (req: Request, res: Response) => {
	try {
		res.sendFile(path.resolve(`./multer/uploads/${req.params.path}`), (e) => {
			res.status(500).json(e);
		});
	} catch (e) {
		console.log(e);
		res.status(500).json(e);
	}
};

export default { getFile };
