import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subjects } from '../subjects';
import { members } from '../../organizations/members/members';

export const absences = pgTable('Absences', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('timestamp'),
	date: timestamp('date').defaultNow(),
	excusedBy: boolean('excused').default(null),
	excusedReason: text('reason').default(null),
	studentID: integer('studentID'),
	teacherID: integer('teacherID'),
	subjectID: integer('subjectID')
});

export const absencesRelations = relations(absences, ({ one }) => ({
	student: one(members, {
		fields: [absences.studentID],
		references: [members.id],
		relationName: 'student'
	}),
	teacher: one(members, {
		fields: [absences.teacherID],
		references: [members.id],
		relationName: 'teacher'
	}),
	subject: one(subjects, {
		fields: [absences.subjectID],
		references: [subjects.id]
	})
}));
