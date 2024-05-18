import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { organizations } from '../organizations/organizations';
import { grades } from '../grades';
import { posts } from '../posts';
import { admins } from '../organizations/admins';
import { classStudents } from '../classes/class-students';
import { classTeachers } from '../classes/class-teachers';
import { subjectStudents } from '../subjects/subject-students';
import { subjectTeachers } from '../subjects/subject-teachers';
import { parents } from './parents';

export const users = pgTable('User', {
	id: serial('id').primaryKey(),
	email: varchar('email').unique(),
	password: varchar('password')
});

export const usersRelations = relations(users, ({ many }) => ({
	ownOrganizations: many(organizations),
	adminInOrganizations: many(admins),
	grades: many(grades, {
		relationName: 'student'
	}),
	givenGrades: many(grades, {
		relationName: 'teacher'
	}),
	absences: many(grades, {
		relationName: 'student'
	}),
	givenAbsences: many(grades, {
		relationName: 'teacher'
	}),
	posts: many(posts),
	studentInClasses: many(classStudents),
	teacherInClasses: many(classTeachers),
	studentInSubjects: many(subjectStudents),
	teacherInSubjects: many(subjectTeachers),
	children: many(parents, {
		relationName: 'parent'
	}),
	parents: many(parents, {
		relationName: 'child'
	})
}));
