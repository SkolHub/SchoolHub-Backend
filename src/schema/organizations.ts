import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const organizations = pgTable('Organization', {
	id: serial('id').primaryKey(),
	name: varchar('name')
});

export const organizationRelations = relations(organizations, () => ({}));
