import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { postTypeEnum } from './enums/post-type-enum';

export const posts = pgTable('Post', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	dueDate: timestamp('dueDate', { mode: 'string' }),
	type: postTypeEnum('postType').notNull(),
	updated: timestamp('updated'),
	sectionID: integer('sectionID'),
	memberID: integer('memberID').notNull(),
	subjectID: integer('subjectID').notNull()
});
