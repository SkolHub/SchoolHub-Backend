import express, {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {

});

router.post('/register', (req: Request, res: Response) => {
    
});

export default router;