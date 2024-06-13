import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { schoolClassesToSubjects } from './school-classes-to-subjects';
import { exemptions } from './exemptions';

export const schoolClasses = pgTable('SchoolClasses', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	tags: text('tags').array().notNull().default([])
});

export const schoolClassesRelations = relations(schoolClasses, ({ many }) => ({
	subjects: many(schoolClassesToSubjects),
	exemptions: many(exemptions)
}));
