import express from 'express';
import cors from 'cors';

import bcrypt from 'bcrypt';

import authRouter from './routes/auth.js';
import accountRouter from './routes/account.js';
import organizationRouter from './routes/organization.js';
import schoolClassRouter from './routes/schoolClass.js';

import { sequelize } from './db.js';
import { authenticateToken } from './middleware/auth.js';
import { User } from './models/User.js';
import { Organization } from './models/Organization.js';
import { User_Organization } from './junctions/User-Organization.js';
import { TextWhiteboardLesson } from './models/TextWhiteboardLesson.js';
import { SchoolClass } from './models/SchoolClass.js';
import { User_SchoolClass } from './junctions/User-SchoolClass.js';

const PORT = 8000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const forceSync = false;

sequelize.sync({ force: forceSync }).then(() => {
    console.log(`Database synced ${ forceSync ? 'and resetted ' : '' }✅`);

    if (forceSync) {
        bcrypt.hash('password', 10).then((hashedPassword) => {
            User.create({
                username: 'Test',
                password: hashedPassword,
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'example'
            });
        });
    }
});

Organization.belongsToMany(User, { through: User_Organization });
User.belongsToMany(Organization, { through: User_Organization });
TextWhiteboardLesson.belongsTo(User);
User.hasMany(TextWhiteboardLesson, { as: 'lessons' });
Organization.hasMany(SchoolClass, { as: 'classes' });
SchoolClass.belongsTo(Organization);
SchoolClass.belongsToMany(User, { through: User_SchoolClass });
User.belongsToMany(SchoolClass, { through: User_SchoolClass });

app.use('/api/auth', authRouter);
app.use('/api/account', authenticateToken, accountRouter);
app.use('/api/organization', authenticateToken, organizationRouter);
app.use('/api/class', authenticateToken, schoolClassRouter);

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});