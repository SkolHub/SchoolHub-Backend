import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { attachmentTypeEnum } from './post-attachments';

export const postSubmissionAttachments = pgTable('PostSubmissionAttachment', {
	id: serial('id').primaryKey(),
	type: attachmentTypeEnum('attachment_type').notNull(),
	source: text('source').notNull(),
	submissionID: integer('submissionID').notNull(),
	studentID: integer('studentID').notNull()
});
