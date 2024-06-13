import { integer, jsonb, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';

export const timetables = pgTable('Timetables', {
	id: serial('id').primaryKey(),
	data: jsonb('data').notNull().default({}),
	organizationID: integer('organizationID').notNull()
});

export const timetablesRelations = relations(timetables, ({ one }) => ({
	organization: one(organizations, {
		fields: [timetables.organizationID],
		references: [organizations.id]
	})
}));
