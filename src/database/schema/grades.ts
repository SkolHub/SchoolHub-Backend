import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const grades = pgTable('Grade', {
	id: serial('id').primaryKey(),
	value: text('value').notNull(),
	reason: text('reason').notNull(),
	date: timestamp('date').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	studentID: integer('studentID').notNull(),
	teacherID: integer('teacherID').notNull(),
	subjectID: integer('subjectID').notNull()
});
