import { Inject } from '@nestjs/common';
import { Database } from '../types/database';

export abstract class DBService {
	@Inject('DB')
	protected readonly db: Database;
}
