import path from 'path';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/:path', (req: Request, res: Response) => {
	res.sendFile(path.resolve(`/multer/uploads/${req.params.path}`), (e) => {
		res.status(500).json(e);
	});
});

export default router;
