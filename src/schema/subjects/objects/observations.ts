import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subjects } from '../subjects';
import { members } from '../../organizations/members/members';

export const observations = pgTable('Observations', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('timestamp').notNull(),
	date: timestamp('date').notNull().defaultNow(),
	message: text('message').notNull(),
	studentID: integer('studentID').notNull(),
	teacherID: integer('teacherID').notNull(),
	subjectID: integer('subjectID').notNull()
});

export const observationsRelations = relations(observations, ({ one }) => ({
	student: one(members, {
		fields: [observations.studentID],
		references: [members.id],
		relationName: 'student'
	}),
	teacher: one(members, {
		fields: [observations.teacherID],
		references: [members.id],
		relationName: 'teacher'
	}),
	subject: one(subjects, {
		fields: [observations.subjectID],
		references: [subjects.id]
	})
}));
