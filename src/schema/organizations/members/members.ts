import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../../users';
import { organizations } from '../organizations';
import { grades } from '../../subjects/objects/grades';
import { absences } from '../../subjects/objects/absences';
import { observations } from '../../subjects/objects/observations';
import { posts } from '../../subjects/objects/posts';
import { exemptions } from '../../school-classes/exemptions';

export const members = pgTable('Members', {
	id: serial('id').primaryKey(),
	userID: integer('userID'),
	organizationID: integer('organizationID').notNull(),
	tags: text('tags').array().notNull().default([]),
	name: text('name').notNull(),
	metadata: jsonb('metadata').notNull().default({}),
	user: text('user').unique(),
	email: text('email').unique(),
	password: text('password')
});

export const studentsRelations = relations(members, ({ one, many }) => ({
	user: one(users, {
		fields: [members.userID],
		references: [users.id]
	}),
	organization: one(organizations, {
		fields: [members.organizationID],
		references: [organizations.id]
	}),
	grades: many(grades, {
		relationName: 'student'
	}),
	givenGrades: many(grades, {
		relationName: 'teacher'
	}),
	absences: many(absences, {
		relationName: 'student'
	}),
	givenAbsences: many(absences, {
		relationName: 'teacher'
	}),
	observations: many(observations, {
		relationName: 'student'
	}),
	givenObservations: many(observations, {
		relationName: 'teacher'
	}),
	posts: many(posts),
	exemptions: many(exemptions, {
		relationName: 'student'
	}),
	givenExemptions: many(exemptions, {
		relationName: 'classMaster'
	})
}));
