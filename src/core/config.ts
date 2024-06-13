import { config } from 'dotenv';

config();

export default process.env as {
	DB_URL: string;
	JWT_SECRET: string;
	JWT_EXPIRATION: string;
};
