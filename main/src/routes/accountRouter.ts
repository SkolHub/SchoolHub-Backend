import express from 'express';
import accountController from '../controllers/accountController';
import upload from '../../multer/upload';

const router = express.Router();

router.get('/', accountController.getAccount);

router.put(
	'/picture',
	upload.single('picture'),
	accountController.updateProfilePicture
);

export default router;
