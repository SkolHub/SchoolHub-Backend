import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CustomClsStore } from '../../common/db.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly cls: ClsService<CustomClsStore>) {}

	canActivate(): boolean {
		if (this.cls.get('role') !== 'admin') {
			throw new ForbiddenException('You are not an admin');
		}

		return true;
	}
}
