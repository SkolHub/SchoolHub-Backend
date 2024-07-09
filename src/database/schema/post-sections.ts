import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const postSections = pgTable('PostSection', {
	id: serial('id').primaryKey(),
	name: text('name'),
	subjectID: integer('subjectID')
});
