import { pgEnum } from 'drizzle-orm/pg-core';

export const postTypeEnum = pgEnum('post_type', [
	'announcement',
	'assignment',
	'test',
	'material'
]);
