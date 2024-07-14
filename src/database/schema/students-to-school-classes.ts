import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const studentsToSchoolClasses = pgTable(
	'StudentToSchoolClass',
	{
		studentID: integer('studentID').notNull(),
		schoolClassID: integer('schoolClassID').notNull()
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.studentID, table.schoolClassID]
		})
	})
);
