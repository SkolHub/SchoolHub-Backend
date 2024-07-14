import { pgEnum } from 'drizzle-orm/pg-core';

export const submissionStatusEnum = pgEnum('SubmissionStatus', [
	'progress',
	'submitted',
	'redo',
	'graded'
]);
