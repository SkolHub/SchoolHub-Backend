import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const postAttachments = pgTable('PostAttachment', {
	id: serial('id').primaryKey(),
	source: text('source').notNull(),
	postID: integer('postID').notNull()
});
