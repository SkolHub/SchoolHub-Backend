import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { members } from './members';
import { subjects } from './subjects';

export const teachersToSubjects = pgTable(
	'TeacherToSubject',
	{
		teacherID: integer('teacherID').notNull(),
		subjectID: integer('subjectID').notNull()
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
