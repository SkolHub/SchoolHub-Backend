import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { members } from './members';

export const tagged = pgTable('Tagged', {
	memberID: integer('memberID')
		.primaryKey()
		.references(() => members.id, { onDelete: 'cascade' }),
	organizationID: integer('organizationID').notNull(),
	tags: text('tags').array().notNull()
});
