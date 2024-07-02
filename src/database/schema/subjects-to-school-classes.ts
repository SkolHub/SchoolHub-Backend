import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { subjects } from './subjects';
import { schoolClasses } from './school-classes';
import { relations } from 'drizzle-orm';

export const subjectsToSchoolClasses = pgTable(
	'subjectToSchoolClass',
	{
		schoolClassID: integer('schoolClassID').references(() => schoolClasses.id),
		subjectID: integer('subjectID').references(() => subjects.id)
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
