import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

export const subjects = pgTable('Subject', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	organizationID: integer('organizationID')
		.notNull()
		.references(() => organizations.id, {
			onDelete: 'cascade'
		})
});