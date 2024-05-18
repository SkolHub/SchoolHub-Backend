import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from '../organizations/organizations';
import { subjects } from '../subjects/subjects';
import { classStudents } from './class-students';
import { classTeachers } from './class-teachers';

export const classes = pgTable('Class', {
	id: serial('id').primaryKey(),
	name: varchar('name'),
	organizationID: integer('organizationID')
});

export const classesRelations = relations(classes, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [classes.organizationID],
		references: [organizations.id]
	}),
	subjects: many(subjects),
	students: many(classStudents),
	teachers: many(classTeachers)
}));
