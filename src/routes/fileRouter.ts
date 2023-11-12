import { express, attachmentController } from '../modules/routerModule';

const router = express.Router();

router.get('/:path', attachmentController.getFile);

export default router;
