import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

const key = 'your_secret_key';

router.post('/login', (req, res) => {
    const { username, email, password } = req.body;

    User.findOne({ where: (username ? { username: username } : { email: email }) }).then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found' });

        user = user.dataValues;

        bcrypt.compare(password, user.password).then((validPassword) => {
            if (!validPassword) return res.status(401).json({ message: 'Wrong password' });

            res.json({ token: jwt.sign({ id: user.id }, key) });

        }).catch((e) => {
            res.status(500).send('Internal Server Error');
        });
    }).catch((e) => {
        res.status(500).send('Internal Server Error');
    });
});

router.post('/register', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    
    bcrypt.hash(password, 10).then((hashedPassword) => {
        User.create({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName
        }).then((user) => {
            res.json(user);
        }).catch((e) => {
            res.status(400).json({
                error: e.errors[0].message
            });
        });
    }).catch((e) => {
        res.status(500).send('Internal Server Error');
    });
});

export default router;