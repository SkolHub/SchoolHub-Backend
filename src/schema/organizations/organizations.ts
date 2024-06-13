import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { admins } from './members/admins';
import { parents } from './members/parents';
import { schoolClasses } from '../school-classes/school-classes';
import { subjects } from '../subjects/subjects';
import { members } from './members/members';

export const organizations = pgTable('Organizations', {
	id: serial('id').primaryKey(),
	name: text('name').notNull()
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
	admins: many(admins),
	parents: many(parents),
	students: many(members, {
		relationName: 'students'
	}),
	teachers: many(members, {
		relationName: 'teachers'
	}),
	schoolClasses: many(schoolClasses),
	subjects: many(subjects)
}));
