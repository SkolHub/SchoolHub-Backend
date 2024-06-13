import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../../users';
import { organizations } from '../organizations';
import { members } from './members';

export const parents = pgTable('Parents', {
	id: serial('id').primaryKey(),
	userID: integer('userID'),
	organizationID: integer('organizationID').notNull(),
	studentID: integer('studentID').notNull(),
	user: text('user').unique(),
	email: text('email').unique(),
	password: text('password')
});

export const parentsRelations = relations(parents, ({ one }) => ({
	user: one(users, {
		fields: [parents.userID],
		references: [users.id],
		relationName: 'parent'
	}),
	organization: one(organizations, {
		fields: [parents.organizationID],
		references: [organizations.id]
	}),
	student: one(members, {
		fields: [parents.studentID],
		references: [members.id]
	})
}));
