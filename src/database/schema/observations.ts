import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const observations = pgTable('Observation', {
	id: serial('id').primaryKey(),
	reason: text('reason').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	studentID: integer('studentID').notNull(),
	teacherID: integer('teacherID').notNull(),
	subjectID: integer('subjectID').notNull()
});
