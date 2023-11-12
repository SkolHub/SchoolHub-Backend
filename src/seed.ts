import prisma from '../prisma/prisma-client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { users, organizations } from './seedData';

dotenv.config();

const seed = () => {
	users.forEach(async (user) => {
		const hashedPassword = await bcrypt.hash(user.password, 10);

        await prisma.user.create({
            data: {
                username: user.username,
                password: hashedPassword,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
	});
};

if (process.env.TEST_DATA === 'true') {
	seed();
}
