import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { IsPasswordStrong } from '../../../../common/constraints/password.constraint';

export class AddAdminDto {
	@IsEmail()
	user: string;

	@IsString()
	@Length(3, 100)
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}
