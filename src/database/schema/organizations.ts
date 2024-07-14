import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const organizations = pgTable('Organization', {
	id: serial('id').primaryKey(),
	ownerID: integer('ownerID').notNull(),
	name: text('name').notNull()
});
