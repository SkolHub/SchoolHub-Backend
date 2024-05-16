import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const grades = pgTable('grades', {
	id: serial('id').primaryKey(),
	value: varchar('value'),
	date: timestamp('date'),
	subjectID: integer('subjectID'),
	studentID: integer('studentID'),
	teacherID: integer('teacherID')
});

export const gradesRelations = relations(grades, () => ({}));
