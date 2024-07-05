import { Inject } from '@nestjs/common';
import { Database } from '../types/database';
import { ClsService, ClsStore } from 'nestjs-cls';

export interface CustomClsStore extends ClsStore {
	userID: number;
	organizationID: number;
	role: 'student' | 'teacher' | 'parent' | 'admin';
	studentID?: number;
}

export abstract class DBService {
	@Inject('DB')
	protected readonly db: Database;

	@Inject()
	private readonly clsService: ClsService<CustomClsStore>;

	get userID(): number {
		return this.clsService.get('userID');
	}

	get organizationID(): number {
		return this.clsService.get('organizationID');
	}

	get role(): number {
		return this.clsService.get('role');
	}

	get studentID(): number {
		return this.clsService.get('studentID');
	}
}
