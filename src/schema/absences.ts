import {
	boolean,
	integer,
	pgTable,
	serial,
	timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users/users';
import { subjects } from './subjects/subjects';

export const absences = pgTable('absences', {
	id: serial('id').primaryKey(),
	excused: boolean('value').default(false),
	date: timestamp('date'),
	subjectID: integer('subjectID'),
	studentID: integer('studentID'),
	teacherID: integer('teacherID')
});

export const absencesRelations = relations(absences, ({ one }) => ({
	student: one(users, {
		fields: [absences.studentID],
		references: [users.id],
		relationName: 'student'
	}),
	teacher: one(users, {
		fields: [absences.teacherID],
		references: [users.id],
		relationName: 'teacher'
	}),
	subject: one(subjects, {
		fields: [absences.subjectID],
		references: [subjects.id]
	})
}));
