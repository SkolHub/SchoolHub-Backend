import { IsPasswordStrong } from '../../../common/constraints/password.constraint';
import { Length, Validate } from 'class-validator';

export class UpdatePasswordDto {
	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}
