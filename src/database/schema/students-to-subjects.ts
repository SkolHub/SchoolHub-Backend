import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { members } from './members';
import { subjects } from './subjects';
import { relations } from 'drizzle-orm';

export const studentsToSubjects = pgTable(
	'StudentToSubject',
	{
		studentID: integer('studentID').references(() => members.id),
		subjectID: integer('subjectID').references(() => subjects.id)
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.studentID, table.subjectID]
		})
	})
);

export const studentsToSubjectsRelations = relations(
	studentsToSubjects,
	({ one }) => ({
		student: one(members, {
			fields: [studentsToSubjects.studentID],
			references: [members.id]
		}),
		subject: one(subjects, {
			fields: [studentsToSubjects.subjectID],
			references: [subjects.id]
		})
	})
);
