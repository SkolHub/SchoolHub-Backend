import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subjects } from '../subjects';
import { members } from '../../organizations/members/members';

export const grades = pgTable('Grades', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('timestamp').notNull(),
	date: timestamp('date').notNull().defaultNow(),
	reason: text('reason').notNull(),
	value: text('value').notNull(),
	studentID: integer('studentID').notNull(),
	teacherID: integer('teacherID').notNull(),
	subjectID: integer('subjectID').notNull()
});

export const gradesRelations = relations(grades, ({ one }) => ({
	student: one(members, {
		fields: [grades.studentID],
		references: [members.id],
		relationName: 'student'
	}),
	teacher: one(members, {
		fields: [grades.teacherID],
		references: [members.id],
		relationName: 'teacher'
	}),
	subject: one(subjects, {
		fields: [grades.subjectID],
		references: [subjects.id]
	})
}));
