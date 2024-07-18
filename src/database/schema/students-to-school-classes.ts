import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import {relations} from "drizzle-orm";
import {members} from "./members";
import {schoolClasses} from "./school-classes";

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

export const studentsToSchoolClassesRelations = relations(
	studentsToSchoolClasses,
	({ one }) => ({
		student: one(members, {
			fields: [studentsToSchoolClasses.studentID],
			references: [members.id]
		}),
		schoolClass: one(schoolClasses, {
			fields: [studentsToSchoolClasses.schoolClassID],
			references: [schoolClasses.id]
		})
	})
);