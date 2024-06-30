import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from '../organizations';
import { users } from '../users';

export const roleEnum = pgEnum('role', [
	'admin',
	'teacher',
	'student',
	'parent'
]);

// TODO: Add password resetting on first login

export const members = pgTable('Members', {
	id: serial('id').primaryKey(),
	organizationID: integer('organizationID').references(() => organizations.id, {
		onDelete: 'cascade'
	}),
	userID: integer('userID'),
	role: roleEnum('role').notNull(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	name: text('name').notNull()
});

export const membersRelations = relations(members, ({ one }) => ({
	organization: one(organizations, {
		fields: [members.organizationID],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [members.userID],
		references: [users.id]
	})
}));
