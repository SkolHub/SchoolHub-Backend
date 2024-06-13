import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subjects } from '../subjects';
import { members } from '../../organizations/members/members';

export const postType = pgEnum('type', ['assignment', 'announcement', 'test']);

export const posts = pgTable('Posts', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	timestamp: timestamp('timestamp').notNull().defaultNow(),
	type: postType('type').notNull(),
	authorID: integer('authorID').notNull(),
	subjectID: integer('subjectID').notNull()
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(members, {
		fields: [posts.authorID],
		references: [members.id]
	}),
	subject: one(subjects, {
		fields: [posts.subjectID],
		references: [subjects.id]
	})
}));
