import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const parents = pgTable(
	'Parent',
	{
		childID: integer('childID'),
		parentID: integer('parentID')
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.parentID, table.childID]
		})
	})
);

export const parentRelations = relations(parents, ({ one }) => ({
	child: one(users, {
		fields: [parents.childID],
		references: [users.id],
		relationName: 'child'
	}),
	parent: one(users, {
		fields: [parents.parentID],
		references: [users.id],
		relationName: 'parent'
	})
}));
