import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subjects } from './subjects';
import { users } from '../users/users';

export const subjectTeachers = pgTable(
	'SubjectTeacher',
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

export const subjectTeacherRelations = relations(
	subjectTeachers,
	({ one }) => ({
		subject: one(subjects, {
			fields: [subjectTeachers.subjectID],
			references: [subjects.id]
		}),
		user: one(users, {
			fields: [subjectTeachers.userID],
			references: [users.id]
		})
	})
);
