import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const schoolClasses = pgTable('SchoolClass', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	classMasterID: integer('classMasterID'),
	organizationID: integer('organizationID').notNull()
});
