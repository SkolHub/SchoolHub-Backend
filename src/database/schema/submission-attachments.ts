import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const submissionAttachments = pgTable('SubmissionAttachment', {
	id: serial('id').primaryKey(),
	source: text('source').notNull(),
	postID: integer('postID').notNull(),
	studentID: integer('studentID').notNull()
});
