import { defineConfig } from 'drizzle-kit';
import config from 'src/core/config';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema/**/*',
	out: './drizzle',
	dbCredentials: {
		url: config.DB_URL
	}
});
