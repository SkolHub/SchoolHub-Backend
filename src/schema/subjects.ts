import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const subjects = pgTable('subjects', {
	id: serial('id').primaryKey(),
	name: varchar('name'),
	icon: varchar('icon'),
	classID: integer('classID')
});

export const subjectsRelations = relations(subjects, () => ({}));
