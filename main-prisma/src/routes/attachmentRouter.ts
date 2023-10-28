import express from 'express';
import attachmentController from '../controllers/attachmentController';

const router = express.Router();

router.get('/:path', attachmentController.getFile);

export default router;
