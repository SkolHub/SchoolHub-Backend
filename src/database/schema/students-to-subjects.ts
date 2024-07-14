import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

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
