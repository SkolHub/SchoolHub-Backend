import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

export interface SessionInterface {
	isGlobal: boolean;
	userID: number;
	organizationID: number;
	role: 'student' | 'teacher' | 'parent' | 'admin';
}
