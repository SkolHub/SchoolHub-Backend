import {
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const postStatusEnum = pgEnum('submission_status', [
	'progress',
	'submitted',
	'redo',
	'graded'
]);

export const postSubmissions = pgTable(
	'PostSubmission',
	{
		postID: integer('postID').notNull(),
		studentID: integer('studentID').notNull(),
		status: postStatusEnum('submission_status').notNull(),
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
