import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../../users';
import { organizations } from '../organizations';

export const admins = pgTable('Admins', {
	id: serial('id').primaryKey(),
	userID: integer('userID'),
	organizationID: integer('organizationID').notNull(),
	user: text('user').unique(),
	email: text('email').unique(),
	password: text('password')
});

export const adminsRelations = relations(admins, ({ one }) => ({
	user: one(users, {
		fields: [admins.userID],
		references: [users.id]
	}),
	organization: one(organizations, {
		fields: [admins.organizationID],
		references: [organizations.id]
	})
}));
