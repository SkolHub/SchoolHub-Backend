import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const postComments = pgTable('PostComment', {
	id: serial('id').primaryKey(),
	body: text('body').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	updated: timestamp('updated').notNull(),
	userID: integer('userID').notNull(),
	postID: integer('postID').notNull()
});
