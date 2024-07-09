import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const postComments = pgTable('PostComment', {
	id: serial('id').primaryKey(),
	body: text('body'),
	timestamp: timestamp('timestamp').defaultNow(),
	updated: timestamp('updated'),
	userID: integer('userID'),
	postID: integer('postID')
});
