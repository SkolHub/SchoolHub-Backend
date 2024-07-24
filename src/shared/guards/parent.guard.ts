import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CustomClsStore } from '../../common/db.service';

@Injectable()
export class ParentGuard implements CanActivate {
	constructor(private readonly cls: ClsService<CustomClsStore>) {}

	canActivate(): boolean {
		if (this.cls.get('role') !== 'parent') {
			throw new ForbiddenException('You are not a parent');
		}

		return true;
	}
}
