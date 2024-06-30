import { integer, pgTable } from 'drizzle-orm/pg-core';
import { members } from './members';

export const parents = pgTable('Parents', {
	memberID: integer('memberID')
		.primaryKey()
		.references(() => members.id, { onDelete: 'cascade' }),
	studentID: integer('studentID')
});
