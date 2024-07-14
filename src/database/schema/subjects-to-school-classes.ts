import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const subjectsToSchoolClasses = pgTable(
	'SubjectToSchoolClass',
	{
		schoolClassID: integer('schoolClassID').notNull(),
		subjectID: integer('subjectID').notNull()
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.schoolClassID, table.subjectID]
		})
	})
);
