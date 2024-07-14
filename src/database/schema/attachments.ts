import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { attachmentTypeEnum } from './enums/attachment-type-enum';

export const attachments = pgTable('Attachment', {
	id: serial('id').primaryKey(),
	type: attachmentTypeEnum('attachmentType').notNull(),
	source: text('source').notNull(),
	submissionID: integer('submissionID').notNull(),
	studentID: integer('studentID').notNull()
});
