import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { classes } from './classes';
import { users } from '../users/users';

export const classStudents = pgTable(
	'ClassStudent',
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

export const classStudentRelations = relations(classStudents, ({ one }) => ({
	schoolClass: one(classes, {
		fields: [classStudents.classID],
		references: [classes.id]
	}),
	user: one(users, {
		fields: [classStudents.userID],
		references: [users.id]
	})
}));
