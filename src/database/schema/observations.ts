import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const observations = pgTable('Observation', {
	id: serial('id').primaryKey(),
	reason: text('reason').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	date: timestamp('date', { mode: 'string' }).notNull(),
	studentID: integer('studentID').notNull(),
	teacherID: integer('teacherID').notNull(),
	subjectID: integer('subjectID').notNull()
});
