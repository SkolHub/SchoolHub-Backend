import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { schoolClasses } from './school-classes';
import { subjects } from '../subjects/subjects';

export const schoolClassesToSubjects = pgTable(
	'SchoolClassesToSubjects',
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

export const schoolClassesToSubjectsRelations = relations(
	schoolClassesToSubjects,
	({ one }) => ({
		schoolClass: one(schoolClasses, {
			fields: [schoolClassesToSubjects.schoolClassID],
			references: [schoolClasses.id]
		}),
		subject: one(subjects, {
			fields: [schoolClassesToSubjects.subjectID],
			references: [subjects.id]
		})
	})
);
