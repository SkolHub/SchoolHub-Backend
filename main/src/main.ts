import express from 'express';
import cors from 'cors';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { sequelize } from './db';

const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cors());

sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
});

app.use('/api/auth');
app.use('/api/account');

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});