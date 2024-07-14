import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const subjects = pgTable('Subject', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	icon: text('icon').notNull(),
	organizationID: integer('organizationID').notNull(),
	metadata: jsonb('metadata').notNull()
});

/* Metadata
 * minGrades?: number
 * */