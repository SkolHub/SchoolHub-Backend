import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import accountRouter from './routes/account';

import { sequelize } from './db';
import { authenticateToken } from './middleware/auth';

const PORT = 8000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const forceSync = true;

sequelize.sync({ force: forceSync }).then(() => {
    console.log(`Database synced ${ forceSync ? 'and resetted ' : '' }✅`);
});

app.use('/api/auth', authRouter);
app.use('/api/account', authenticateToken, accountRouter);

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});