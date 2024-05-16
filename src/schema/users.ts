import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('User', {
	id: serial('id').primaryKey(),
	email: varchar('email').unique(),
	password: varchar('password')
});

export const usersRelations = relations(users, () => ({}));
