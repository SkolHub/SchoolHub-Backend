import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.user) return;
    
    User.findByPk(req.user.id).then((user) => {

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        });
    }).catch((e) => {
        res.status(500).send('Internal Server Error');
    });
});

export default router;