import { jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { grades } from './objects/grades';
import { absences } from './objects/absences';
import { observations } from './objects/observations';
import { schoolClassesToSubjects } from '../school-classes/school-classes-to-subjects';
import { posts } from './objects/posts';

export const subjects = pgTable('Subjects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	icon: text('icon').notNull(),
	tags: text('tags').array().notNull().default([]),
	permissions: jsonb('permissions').notNull().default({}),
	metadata: jsonb('metadata').notNull().default({})
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
	grades: many(grades),
	absences: many(absences),
	observations: many(observations),
	posts: many(posts),
	schoolClasses: many(schoolClassesToSubjects)
}));
