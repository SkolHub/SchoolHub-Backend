import { config } from 'dotenv';

config();

export default process.env as {
	DB_URL: string;
	JWT_SECRET: string;
	JWT_EXPIRATION: string;

	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_CALLBACK_URL: string;

	FACEBOOK_CLIENT_ID: string;
	FACEBOOK_CLIENT_SECRET: string;
	FACEBOOK_CALLBACK_URL: string;

	APPLE_CLIENT_ID: string;
	APPLE_TEAM_ID: string;
	APPLE_KEY_ID: string;
	APPLE_PRIVATE_KEYFILE_PATH: string;
	APPLE_CALLBACK_URL: string;

	HOME_URL: string;

	COOKIE_MAX_AGE: string;
	COOKIE_SECRET: string;
};
