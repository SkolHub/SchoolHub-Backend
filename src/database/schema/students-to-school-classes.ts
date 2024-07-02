import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { members } from './members';
import { subjects } from './subjects';
import { relations } from 'drizzle-orm';
import { schoolClasses } from './school-classes';

export const studentsToSchoolClasses = pgTable(
	'StudentToSchoolClass',
	{
		studentID: integer('studentID').references(() => members.id),
		schoolClassID: integer('schoolClassID').references(() => schoolClasses.id)
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.studentID, table.schoolClassID]
		})
	})
);

export const studentsToSchoolClassesRelations = relations(
	studentsToSchoolClasses,
	({ one }) => ({
		student: one(members, {
			fields: [studentsToSchoolClasses.studentID],
			references: [members.id]
		}),
		schoolClass: one(subjects, {
			fields: [studentsToSchoolClasses.schoolClassID],
			references: [subjects.id]
		})
	})
);
