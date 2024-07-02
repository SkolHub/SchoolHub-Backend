import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { relations } from 'drizzle-orm';
import { members } from './members';
import { subjectsToSchoolClasses } from './subjects-to-school-classes';
import { studentsToSchoolClasses } from './students-to-school-classes';

export const schoolClasses = pgTable('SchoolClass', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	classMasterID: integer('classMasterID'),
	organizationID: integer('organizationID')
		.notNull()
		.references(() => organizations.id, {
			onDelete: 'cascade'
		})
});

export const schoolClassesRelations = relations(
	schoolClasses,
	({ one, many }) => ({
		classMaster: one(members, {
			fields: [schoolClasses.classMasterID],
			references: [members.id]
		}),
		subjects: many(subjectsToSchoolClasses),
		students: many(studentsToSchoolClasses)
	})
);
