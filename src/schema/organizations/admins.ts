import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../users/users';
import { organizations } from './organizations';

export const admins = pgTable(
	'Admin',
	{
		userID: integer('userID'),
		organizationID: integer('organizationID')
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userID, table.organizationID]
		})
	})
);

export const adminRelations = relations(admins, ({ one }) => ({
	user: one(users, {
		fields: [admins.userID],
		references: [users.id]
	}),
	organization: one(organizations, {
		fields: [admins.organizationID],
		references: [organizations.id]
	})
}));
