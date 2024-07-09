import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CustomClsStore } from '../../common/db.service';

@Injectable()
export class TeacherGuard implements CanActivate {
	constructor(private readonly cls: ClsService<CustomClsStore>) {}

	canActivate(): boolean {
		if (this.cls.get('role') !== 'teacher') {
			throw new ForbiddenException('You are not a teacher');
		}

		return true;
	}
}
