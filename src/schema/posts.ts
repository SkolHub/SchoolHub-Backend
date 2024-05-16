import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	title: varchar('title'),
	body: varchar('body'),
	assignment: boolean('assignment')
});
