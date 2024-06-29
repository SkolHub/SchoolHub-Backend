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

export const members = pgTable('Members', {
	id: serial('id').primaryKey(),
	organizationID: integer('organizationID').notNull(),
	userID: integer('userID'),
	role: roleEnum('role').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull()
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
