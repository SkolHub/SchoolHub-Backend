import {
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text
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
		comment: text('comment')
	},
	(table) => ({
		pk: primaryKey({
			columns: [postSubmissions.postID, postSubmissions.studentID]
		})
	})
);
