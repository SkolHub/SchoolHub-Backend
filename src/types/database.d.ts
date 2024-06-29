import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

export type Database = NodePgDatabase<typeof schema>;
