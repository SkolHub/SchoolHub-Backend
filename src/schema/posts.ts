import {
	boolean,
	integer,
	pgTable,
	serial,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users/users';
import { subjects } from './subjects/subjects';

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	title: varchar('title'),
	body: varchar('body'),
	assignment: boolean('assignment'),
	date: timestamp('date'),
	subjectID: integer('subjectID'),
	authorID: integer('teacherID')
});

export const postRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorID],
		references: [users.id]
	}),
	subject: one(subjects, {
		fields: [posts.subjectID],
		references: [subjects.id]
	})
}));
