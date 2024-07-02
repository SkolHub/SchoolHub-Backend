import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { members } from './members';
import { subjects } from './subjects';
import { relations } from 'drizzle-orm';

export const teachersToSubjects = pgTable(
	'TeacherToSubject',
	{
		teacherID: integer('teacherID').references(() => members.id),
		subjectID: integer('subjectID').references(() => subjects.id)
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.teacherID, table.subjectID]
		})
	})
);

export const teachersToSubjectsRelations = relations(
	teachersToSubjects,
	({ one }) => ({
		teacher: one(members, {
			fields: [teachersToSubjects.teacherID],
			references: [members.id]
		}),
		subject: one(subjects, {
			fields: [teachersToSubjects.subjectID],
			references: [subjects.id]
		})
	})
);
