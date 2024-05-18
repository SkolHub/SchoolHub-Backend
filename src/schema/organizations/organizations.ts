import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../users/users';
import { classes } from '../classes/classes';
import { admins } from './admins';

export const organizations = pgTable('Organization', {
	id: serial('id').primaryKey(),
	name: varchar('name'),
	ownerID: integer('ownerID')
});

export const organizationRelations = relations(
	organizations,
	({ one, many }) => ({
		owner: one(users, {
			fields: [organizations.ownerID],
			references: [users.id]
		}),
		classes: many(classes),
		admins: many(admins)
	})
);
