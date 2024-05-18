import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { classes } from './classes';
import { users } from '../users/users';

export const classTeachers = pgTable(
	'ClassTeacher',
	{
		userID: integer('userID'),
		classID: integer('classID')
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userID, table.classID]
		})
	})
);

export const classTeacherRelations = relations(classTeachers, ({ one }) => ({
	schoolClass: one(classes, {
		fields: [classTeachers.classID],
		references: [classes.id]
	}),
	user: one(users, {
		fields: [classTeachers.userID],
		references: [users.id]
	})
}));
