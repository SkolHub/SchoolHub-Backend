import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

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
