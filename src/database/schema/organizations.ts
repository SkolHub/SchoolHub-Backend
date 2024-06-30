import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { members } from './members/members';

export const organizations = pgTable('Organizations', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	ownerID: integer('ownerID').notNull()
});

export const organizationsRelations = relations(organizations, ({ one }) => ({
	creator: one(members, {
		fields: [organizations.ownerID],
		references: [members.id]
	})
}));
