import { CanActivate, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CustomClsStore } from '../../common/db.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly cls: ClsService<CustomClsStore>) {}

	canActivate(): boolean {
		return this.cls.get('role') === 'admin';
	}
}
