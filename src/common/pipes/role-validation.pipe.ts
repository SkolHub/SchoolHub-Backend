import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RoleValidationPipe implements PipeTransform {
	private readonly roles = ['parent', 'student', 'teacher'];

	transform(value: string) {
		if (!this.roles.includes(value)) {
			throw new BadRequestException(`Invalid role: ${value}`);
		}

		return value;
	}
}
