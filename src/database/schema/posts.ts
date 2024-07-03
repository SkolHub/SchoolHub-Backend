import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const postTypeEnum = pgEnum('post_type', [
	'announcement',
	'assignment',
	'test'
]);

export const posts = pgTable('Post', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	type: postTypeEnum('post_type'),
	memberID: integer('memberID').notNull(),
	subjectID: integer('subjectID').notNull()
});
