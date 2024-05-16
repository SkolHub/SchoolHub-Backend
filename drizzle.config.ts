import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    dialect: "postgresql",
    schema: "./schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: 'postgresql://postgres:test12345@localhost:5432/fiicode',

    }
});