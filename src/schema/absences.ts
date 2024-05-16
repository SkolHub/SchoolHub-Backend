import {
	boolean,
	integer,
	pgTable,
	serial,
	timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const absences = pgTable('absences', {
	id: serial('id').primaryKey(),
	excused: boolean('value').default(false),
	date: timestamp('date'),
	subjectID: integer('subjectID'),
	studentID: integer('studentID'),
	teacherID: integer('teacherID')
});

export const absencesRelations = relations(absences, () => ({}));
