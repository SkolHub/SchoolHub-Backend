import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {organizations} from "./organizations";

export const users = pgTable('Users', {
	id: serial('id').primaryKey(),
	email: text('email').unique().notNull(),
	password: text('password').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	organizations: many(organizations)
}));
