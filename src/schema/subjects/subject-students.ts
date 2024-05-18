import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../users/users';
import { subjects } from './subjects';

export const subjectStudents = pgTable(
	'SubjectStudent',
	{
		userID: integer('userID'),
		subjectID: integer('subjectID')
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userID, table.subjectID]
		})
	})
);

export const subjectStudentRelations = relations(
	subjectStudents,
	({ one }) => ({
		subject: one(subjects, {
			fields: [subjectStudents.subjectID],
			references: [subjects.id]
		}),
		user: one(users, {
			fields: [subjectStudents.userID],
			references: [users.id]
		})
	})
);
