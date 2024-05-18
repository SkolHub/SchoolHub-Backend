import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { classes } from '../classes/classes';
import { grades } from '../grades';
import { absences } from '../absences';
import { posts } from '../posts';
import { subjectStudents } from './subject-students';
import { subjectTeachers } from './subject-teachers';

export const subjects = pgTable('subjects', {
	id: serial('id').primaryKey(),
	name: varchar('name'),
	icon: varchar('icon'),
	classID: integer('classID')
});

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
	schoolClass: one(classes, {
		fields: [subjects.classID],
		references: [classes.id]
	}),
	grades: many(grades),
	absences: many(absences),
	posts: many(posts),
	students: many(subjectStudents),
	teachers: many(subjectTeachers)
}));
