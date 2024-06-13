import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { schoolClasses } from './school-classes';
import { members } from '../organizations/members/members';

export const exemptions = pgTable('Exemptions', {
	id: serial('id').primaryKey(),
	startTimestamp: timestamp('startTimestamp').notNull(),
	endTimestamp: timestamp('endTimestamp').notNull(),
	reason: text('reason').notNull(),
	schoolClassID: integer('schoolClassID').notNull(),
	studentID: integer('studentID').notNull(),
	classMasterID: integer('teacherID').notNull()
});

export const exemptionsRelations = relations(exemptions, ({ one }) => ({
	schoolClass: one(schoolClasses, {
		fields: [exemptions.schoolClassID],
		references: [schoolClasses.id]
	}),
	studentID: one(members, {
		fields: [exemptions.studentID],
		references: [members.id],
		relationName: 'student'
	}),
	classMasterID: one(members, {
		fields: [exemptions.classMasterID],
		references: [members.id],
		relationName: 'classMaster'
	})
}));
