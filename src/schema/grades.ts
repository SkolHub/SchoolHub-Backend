import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users/users';
import { subjects } from './subjects/subjects';

export const grades = pgTable('grades', {
	id: serial('id').primaryKey(),
	value: varchar('value'),
	date: timestamp('date'),
	subjectID: integer('subjectID'),
	studentID: integer('studentID'),
	teacherID: integer('teacherID')
});

export const gradesRelations = relations(grades, ({ one }) => ({
	student: one(users, {
		fields: [grades.studentID],
		references: [users.id],
		relationName: 'student'
	}),
	teacher: one(users, {
		fields: [grades.teacherID],
		references: [users.id],
		relationName: 'teacher'
	}),
	subject: one(subjects, {
		fields: [grades.subjectID],
		references: [subjects.id]
	})
}));
