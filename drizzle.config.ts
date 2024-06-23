import { defineConfig } from 'drizzle-kit';
import env from 'src/core/env';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema/**/*',
	out: './drizzle',
	dbCredentials: {
		url: env.DB_URL
	}
});
