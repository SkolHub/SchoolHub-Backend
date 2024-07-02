import { integer, pgTable } from 'drizzle-orm/pg-core';

export const parents = pgTable('Parent', {
	memberID: integer('memberID').primaryKey(),
	studentID: integer('studentID').notNull()
});
