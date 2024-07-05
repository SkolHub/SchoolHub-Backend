import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { studentsToSubjects } from './students-to-subjects';
import { teachersToSubjects } from './teachers-to-subjects';
import { subjectsToSchoolClasses } from './subjects-to-school-classes';

export const subjects = pgTable('Subject', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	icon: text('icon').notNull(),
	organizationID: integer('organizationID')
		.notNull()
		.references(() => organizations.id, {
			onDelete: 'cascade'
		}),
	metadata: jsonb('metadata').notNull()
});

/* Metadata
 * minGrades?: number
 * */

export const subjectsRelations = relations(subjects, ({ many }) => ({
	students: many(studentsToSubjects),
	teachers: many(teachersToSubjects),
	schoolClasses: many(subjectsToSchoolClasses)
}));
