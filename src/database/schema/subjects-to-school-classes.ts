import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { schoolClasses } from './school-classes';
import { subjects } from './subjects';

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

export const subjectsToSchoolClassesRelations = relations(
	subjectsToSchoolClasses,
	({ one }) => ({
		schoolClass: one(schoolClasses, {
			fields: [subjectsToSchoolClasses.schoolClassID],
			references: [schoolClasses.id]
		}),
		subject: one(subjects, {
			fields: [subjectsToSchoolClasses.subjectID],
			references: [subjects.id]
		})
	})
);
