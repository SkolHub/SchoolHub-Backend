import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class StudentGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		return request.user.role === 'student';
	}
}
