import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { members } from './members';
import { subjects } from './subjects';

export const studentsToSubjects = pgTable(
	'StudentToSubject',
	{
		studentID: integer('studentID').notNull(),
		subjectID: integer('subjectID').notNull()
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
