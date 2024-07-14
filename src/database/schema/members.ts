import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { roleEnum } from './enums/role-enum';

export const members = pgTable('Member', {
	id: serial('id').primaryKey(),
	user: text('user').notNull().unique(),
	name: text('name').notNull(),
	password: text('password').notNull(),
	role: roleEnum('role').notNull(),
	organizationID: integer('organizationID')
});
