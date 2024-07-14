import {
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { submissionStatusEnum } from './enums/submission-status-enum';

export const postSubmissions = pgTable(
	'PostSubmission',
	{
		postID: integer('postID').notNull(),
		studentID: integer('studentID').notNull(),
		status: submissionStatusEnum('submissionStatus').notNull(),
		gradeID: integer('gradeID'),
		comment: text('comment'),
		timestamp: timestamp('timestamp')
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.postID, table.studentID]
		})
	})
);
