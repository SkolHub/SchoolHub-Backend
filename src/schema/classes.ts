import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const classes = pgTable('Class', {
	id: serial('id').primaryKey(),
	name: varchar('name'),
	organizationID: integer('organizationID')
});

export const classesRelations = relations(classes, () => ({}));
