import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', [
	'admin',
	'parent',
	'student',
	'teacher'
]);

export const members = pgTable('Member', {
	id: serial('id').primaryKey(),
	user: text('user').notNull().unique(),
	name: text('name').notNull(),
	password: text('password').notNull(),
	role: roleEnum('role').notNull(),
	organizationID: integer('organizationID').references(() => organizations.id, {
		onDelete: 'cascade'
	})
});

export const membersRelations = relations(members, ({ one }) => ({
	organization: one(organizations, {
		fields: [members.organizationID],
		references: [organizations.id]
	})
}));
