import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { admins } from './organizations/members/admins';
import { parents } from './organizations/members/parents';
import { members } from './organizations/members/members';

export const users = pgTable('Users', {
	id: serial('id').primaryKey(),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	admin: boolean('admin').default(false).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	adminIn: many(admins),
	memberIn: many(members),
	parentIn: many(parents)
}));
