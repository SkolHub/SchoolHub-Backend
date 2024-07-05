import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const absences = pgTable('Absence', {
	id: serial('id').primaryKey(),
	excused: boolean('excused').default(false).notNull(),
	reason: text('reason').notNull(),
	date: timestamp('date', { mode: 'string' }).notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
	studentID: integer('studentID').notNull(),
	teacherID: integer('teacherID').notNull(),
	subjectID: integer('subjectID').notNull()
});
