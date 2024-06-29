import { defineConfig } from 'drizzle-kit';
import env from 'src/config/config';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/database/schema/**/*',
	out: './src/database/migrations',
	dbCredentials: {
		url: env.DB_URL
	}
});
